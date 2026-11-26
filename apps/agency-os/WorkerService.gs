/**
 * Autonomous Workflow Engine
 * Trigger-driven, resumable execution. One task is processed per worker invocation.
 * Safe mode is ON by default. External side effects are not implemented here.
 */
const WORKER_CONFIG = {
  HANDLER: 'agencyWorkerTick',
  LEASE_MINUTES: 8,
  MAX_TASKS_PER_TICK: 1,
  MAX_DAILY_RUNS: 30,
  MAX_RETRIES: 3,
  MAX_WORKFLOW_STEPS: 8,
  BASE_RETRY_SECONDS: 90
};

function agencyWorkerTick() {
  const props = PropertiesService.getScriptProperties();
  if (props.getProperty('AGENCY_OS_WORKERS_PAUSED') !== 'false') {
    return {ok: true, skipped: true, reason: 'Workers are paused or not enabled.'};
  }
  if (!props.getProperty('GEMINI_API_KEY')) {
    pauseAgencyWorkers();
    throw new Error('Missing GEMINI_API_KEY. Workers have been paused.');
  }
  const task = claimNextTask_();
  if (!task) return {ok: true, processed: 0, reason: 'No eligible queued tasks.'};
  if (!reserveDailyBudget_()) {
    updateTask_(task.task_id, {execution_status: 'QUEUED', lease_until: '', attempt_count: Math.max(0, Number(task.attempt_count || 1) - 1), updated_at: now_()});
    pauseAgencyWorkers();
    return {ok: false, paused: true, reason: 'Daily AI run limit reached.'};
  }
  executeClaimedTask_(task);
  return {ok: true, processed: 1, taskId: task.task_id};
}

function claimNextTask_() {
  return withLock_(function() {
    const now = Date.now();
    const tasks = readRows_('Tasks');
    // Recover expired leases from a previous interrupted invocation.
    tasks.forEach(function(task) {
      const status = String(task.execution_status || '').toUpperCase();
      const lease = task.lease_until ? new Date(task.lease_until).getTime() : 0;
      if ((status === 'CLAIMED' || status === 'RUNNING') && lease && lease < now) {
        updateTask_(task.task_id, {
          execution_status: 'RETRY_WAIT',
          run_after: new Date(now + WORKER_CONFIG.BASE_RETRY_SECONDS * 1000).toISOString(),
          lease_until: '',
          error_message: 'Worker lease expired; task returned to retry queue.',
          updated_at: now_()
        });
        appendAudit_(task.workspace_id, 'SYSTEM', 'worker', 'TASK_LEASE_EXPIRED', 'Task', task.task_id, {});
      }
    });

    const fresh = readRows_('Tasks').filter(function(task) {
      const status = String(task.execution_status || '').toUpperCase();
      const runAfter = task.run_after ? new Date(task.run_after).getTime() : 0;
      return (status === 'QUEUED' || status === 'RETRY_WAIT') && (!runAfter || runAfter <= now);
    });
    fresh.sort(function(a, b) {
      const priority = {HIGH: 0, NORMAL: 1, LOW: 2};
      const p = (priority[String(a.priority).toUpperCase()] || 1) - (priority[String(b.priority).toUpperCase()] || 1);
      return p || new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    if (!fresh.length) return null;

    const selected = fresh[0];
    const leaseUntil = new Date(now + WORKER_CONFIG.LEASE_MINUTES * 60000).toISOString();
    updateTask_(selected.task_id, {
      execution_status: 'CLAIMED',
      lease_until: leaseUntil,
      attempt_count: Number(selected.attempt_count || 0) + 1,
      updated_at: now_()
    });
    appendAudit_(selected.workspace_id, 'SYSTEM', 'worker', 'TASK_CLAIMED', 'Task', selected.task_id, {lease_until: leaseUntil});
    selected.execution_status = 'CLAIMED';
    selected.lease_until = leaseUntil;
    selected.attempt_count = Number(selected.attempt_count || 0) + 1;
    return selected;
  });
}

function executeClaimedTask_(task) {
  try {
    updateTask_(task.task_id, {execution_status: 'RUNNING', updated_at: now_()});
    const workspace = readRows_('Workspaces').find(function(w) { return w.workspace_id === task.workspace_id; });
    if (!workspace) throw new Error('Workspace not found for task.');
    const result = geminiGenerate_(task.department, task, workspace);
    const output = result.output;
    const completedAt = now_();

    const approvalGate = task.department === 'Approval Manager' && output.status !== 'BLOCKED';
    updateTask_(task.task_id, {
      execution_status: output.status === 'BLOCKED' ? 'BLOCKED' : (approvalGate ? 'WAITING_APPROVAL' : 'SUCCEEDED'),
      lifecycle_status: output.status === 'BLOCKED' ? 'BLOCKED' : lifecycleForDepartment_(task.department),
      output_json: JSON.stringify(output),
      error_message: '',
      lease_until: '',
      updated_at: completedAt
    });
    appendAgentRun_(task, result, 'SUCCEEDED');
    appendAudit_(task.workspace_id, 'AI_AGENT', task.department, 'TASK_EXECUTED', 'Task', task.task_id, {
      provider: result.provider, model: result.model, finishReason: result.finishReason
    });

    if (output.status !== 'BLOCKED' && !approvalGate && output.next_department && output.next_task_title) {
      createFollowupTask_(task, output);
    }
  } catch (err) {
    handleTaskFailure_(task, err);
  }
}

function createFollowupTask_(parent, output) {
  const department = String(output.next_department || '');
  if (AGENCY_OS.DEPARTMENTS.indexOf(department) === -1) return;
  const stepIndex = Number(parent.step_index || 0);
  if (stepIndex >= WORKER_CONFIG.MAX_WORKFLOW_STEPS - 1) {
    appendAudit_(parent.workspace_id, 'SYSTEM', 'workflow-engine', 'WORKFLOW_STEP_LIMIT_REACHED', 'Task', parent.task_id, {limit: WORKER_CONFIG.MAX_WORKFLOW_STEPS});
    return;
  }
  const workflowTask = parent.task_type === 'AGENCY_WORKFLOW' || parent.task_type === 'WORKFLOW_STEP';
  if (workflowTask) {
    const pipeline = ['Research & Strategy', 'Content Planner', 'Scriptwriter', 'Creative Production', 'Quality Control', 'Approval Manager', 'Social Distribution', 'Performance Analytics'];
    const expected = pipeline[pipeline.indexOf(parent.department) + 1] || '';
    if (!expected || department !== expected) {
      appendAudit_(parent.workspace_id, 'SYSTEM', 'workflow-engine', 'FOLLOWUP_ROUTE_REJECTED', 'Task', parent.task_id, {expected_department: expected, proposed_department: department});
      return;
    }
  }
  const idempotencyKey = parent.task_id + '->' + department;
  if (readRows_('Tasks').some(function(row) { return row.idempotency_key === idempotencyKey; })) return;
  const id = 'task_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16);
  const now = now_();
  appendRow_('Tasks', {
    task_id: id,
    workspace_id: parent.workspace_id,
    project_id: parent.project_id || '',
    campaign_id: parent.campaign_id || '',
    department: department,
    task_type: 'WORKFLOW_STEP',
    title: String(output.next_task_title).slice(0, 180),
    description: String(output.next_task_description || '').slice(0, 5000),
    priority: parent.priority || 'NORMAL',
    execution_status: 'QUEUED',
    lifecycle_status: 'IDEA',
    assigned_agent: department,
    input_json: JSON.stringify({parent_task_id: parent.task_id, parent_deliverable: output.deliverable, workflow_context: safeJson_(parent.input_json)}),
    output_json: '',
    attempt_count: 0,
    max_attempts: WORKER_CONFIG.MAX_RETRIES,
    run_after: now,
    lease_until: '',
    idempotency_key: idempotencyKey,
    error_message: '',
    workflow_id: parent.workflow_id || parent.task_id,
    parent_task_id: parent.task_id,
    step_index: stepIndex + 1,
    created_at: now,
    updated_at: now
  });
  appendAudit_(parent.workspace_id, 'SYSTEM', 'workflow-engine', 'FOLLOWUP_TASK_CREATED', 'Task', id, {
    parent_task_id: parent.task_id, department: department
  });
}

function handleTaskFailure_(task, err) {
  const attempt = Number(task.attempt_count || 1);
  const max = Math.min(WORKER_CONFIG.MAX_RETRIES, Number(task.max_attempts || WORKER_CONFIG.MAX_RETRIES));
  const retry = attempt < max;
  const delay = WORKER_CONFIG.BASE_RETRY_SECONDS * Math.pow(2, Math.max(0, attempt - 1));
  updateTask_(task.task_id, {
    execution_status: retry ? 'RETRY_WAIT' : 'FAILED',
    error_message: String(err && err.message ? err.message : err).slice(0, 1500),
    run_after: retry ? new Date(Date.now() + delay * 1000).toISOString() : '',
    lease_until: '',
    updated_at: now_()
  });
  appendAgentRun_(task, {provider: 'gemini', model: PropertiesService.getScriptProperties().getProperty('AGENCY_OS_MODEL') || AGENT_GATEWAY.DEFAULT_MODEL, output: {error: String(err).slice(0, 1000)}}, retry ? 'RETRY_WAIT' : 'FAILED');
  appendAudit_(task.workspace_id, 'SYSTEM', 'worker', retry ? 'TASK_RETRY_SCHEDULED' : 'TASK_FAILED', 'Task', task.task_id, {
    attempt: attempt, max_attempts: max, error: String(err).slice(0, 1000)
  });
}

function updateTask_(taskId, changes) {
  const sheet = getDatabase_().getSheetByName('Tasks');
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const idIndex = headers.indexOf('task_id');
  if (idIndex < 0) throw new Error('Tasks sheet is missing task_id column.');
  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idIndex]) !== String(taskId)) continue;
    Object.keys(changes).forEach(function(key) {
      const c = headers.indexOf(key);
      if (c >= 0) sheet.getRange(r + 1, c + 1).setValue(changes[key]);
    });
    return;
  }
  throw new Error('Task not found: ' + taskId);
}

function appendAgentRun_(task, result, status) {
  appendRow_('AgentRuns', {
    run_id: 'run_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16),
    workspace_id: task.workspace_id,
    task_id: task.task_id,
    department: task.department,
    provider: result.provider || 'gemini',
    model: result.model || '',
    status: status,
    usage_json: JSON.stringify(result.usage || {}),
    output_json: JSON.stringify(result.output || {}),
    created_at: now_()
  });
}

function lifecycleForDepartment_(department) {
  const map = {
    'Research & Strategy': 'RESEARCHED',
    'Content Planner': 'PLANNED',
    'Scriptwriter': 'SCRIPT_DRAFT',
    'Creative Production': 'PRODUCTION_BRIEF',
    'Quality Control': 'QC_REVIEW',
    'Approval Manager': 'PENDING_APPROVAL',
    'Social Distribution': 'PENDING_APPROVAL',
    'Performance Analytics': 'PERFORMANCE_REVIEW'
  };
  return map[department] || 'IDEA';
}

function reserveDailyBudget_() {
  return withLock_(function() {
    const props = PropertiesService.getScriptProperties();
    const today = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyy-MM-dd');
    const key = 'AGENCY_OS_RUNS_' + today;
    const used = Number(props.getProperty(key) || 0);
    const limit = Number(props.getProperty('AGENCY_OS_MAX_DAILY_RUNS') || WORKER_CONFIG.MAX_DAILY_RUNS);
    if (used >= limit) return false;
    props.setProperty(key, String(used + 1));
    return true;
  });
}

function enableAgencyWorkers() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('GEMINI_API_KEY')) throw new Error('Add GEMINI_API_KEY to Script Properties before enabling workers.');
  props.setProperty('AGENCY_OS_WORKERS_PAUSED', 'false');
  const exists = ScriptApp.getProjectTriggers().some(function(trigger) {
    return trigger.getHandlerFunction() === WORKER_CONFIG.HANDLER;
  });
  if (!exists) {
    ScriptApp.newTrigger(WORKER_CONFIG.HANDLER).timeBased().everyMinutes(5).create();
  }
  appendAudit_('ws_studionline', 'OWNER', 'setup', 'WORKERS_ENABLED', 'System', 'agency-os', {interval_minutes: 5});
  return {ok: true, worker: 'ENABLED', intervalMinutes: 5};
}

function pauseAgencyWorkers() {
  PropertiesService.getScriptProperties().setProperty('AGENCY_OS_WORKERS_PAUSED', 'true');
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === WORKER_CONFIG.HANDLER) ScriptApp.deleteTrigger(trigger);
  });
  return {ok: true, worker: 'PAUSED'};
}

function agencyWorkerStatus() {
  const props = PropertiesService.getScriptProperties();
  return {
    provider: 'gemini',
    model: props.getProperty('AGENCY_OS_MODEL') || AGENT_GATEWAY.DEFAULT_MODEL,
    worker: props.getProperty('AGENCY_OS_WORKERS_PAUSED') === 'false' ? 'ENABLED' : 'PAUSED',
    triggerInstalled: ScriptApp.getProjectTriggers().some(function(t) { return t.getHandlerFunction() === WORKER_CONFIG.HANDLER; }),
    dailyLimit: Number(props.getProperty('AGENCY_OS_MAX_DAILY_RUNS') || WORKER_CONFIG.MAX_DAILY_RUNS)
  };
}
