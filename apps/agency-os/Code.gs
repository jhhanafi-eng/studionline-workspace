/**
 * Karyawan Agency STUDIONLINE OS
 * Agency OS foundation: workspace registry, workflow intake, task queue, approvals and audit log.
 * Gemini workers are paused by default; external actions remain disabled.
 */
const AGENCY_OS = {
  DB_PROPERTY: 'AGENCY_OS_DB_ID',
  SHEETS: {
    Workspaces: ['workspace_id', 'name', 'type', 'status', 'timezone', 'brand_brief_json', 'created_at', 'updated_at'],
    Tasks: ['task_id', 'workspace_id', 'project_id', 'campaign_id', 'department', 'task_type', 'title', 'description', 'priority', 'execution_status', 'lifecycle_status', 'assigned_agent', 'input_json', 'output_json', 'attempt_count', 'max_attempts', 'run_after', 'lease_until', 'idempotency_key', 'error_message', 'workflow_id', 'parent_task_id', 'step_index', 'created_at', 'updated_at'],
    AgentRuns: ['run_id', 'workspace_id', 'task_id', 'department', 'provider', 'model', 'status', 'usage_json', 'output_json', 'created_at'],
    Approvals: ['approval_id', 'workspace_id', 'task_id', 'payload_hash', 'decision', 'decided_by', 'decided_at', 'created_at'],
    AuditLog: ['event_id', 'workspace_id', 'actor_type', 'actor_id', 'event_type', 'entity_type', 'entity_id', 'details_json', 'created_at']
  },
  DEPARTMENTS: ['Research & Strategy', 'Content Planner', 'Scriptwriter', 'Creative Production', 'Quality Control', 'Approval Manager', 'Social Distribution', 'Performance Analytics']
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Karyawan Agency STUDIONLINE')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Run once manually from the Apps Script editor as the owner.
 * Creates the operational spreadsheet and required tabs.
 */
function setupAgencyOS() {
  const props = PropertiesService.getScriptProperties();
  let dbId = props.getProperty(AGENCY_OS.DB_PROPERTY);
  let ss;

  if (dbId) {
    ss = SpreadsheetApp.openById(dbId);
  } else {
    ss = SpreadsheetApp.create('STUDIONLINE Agency OS Database');
    dbId = ss.getId();
    props.setProperty(AGENCY_OS.DB_PROPERTY, dbId);
  }

  Object.keys(AGENCY_OS.SHEETS).forEach(function(name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    ensureHeaders_(sheet, AGENCY_OS.SHEETS[name]);
  });

  if (!props.getProperty('AGENCY_OS_MODEL')) props.setProperty('AGENCY_OS_MODEL', 'gemini-3.5-flash-lite');
  if (!props.getProperty('AGENCY_OS_WORKERS_PAUSED')) props.setProperty('AGENCY_OS_WORKERS_PAUSED', 'true');
  if (!props.getProperty('AGENCY_OS_MAX_DAILY_RUNS')) props.setProperty('AGENCY_OS_MAX_DAILY_RUNS', '30');

  const workspaces = readRows_('Workspaces');
  const ownerWorkspace = workspaces.find(function(row) { return row.workspace_id === 'ws_studionline'; });
  if (!ownerWorkspace) {
    const now = now_();
    appendRow_('Workspaces', {
      workspace_id: 'ws_studionline',
      name: 'STUDIONLINE',
      type: 'OWNER',
      status: 'ACTIVE',
      timezone: 'Asia/Jakarta',
      brand_brief_json: JSON.stringify({positioning: 'Digital Design & Automation Studio', objective_90_days: 'Digital product sales', audience: 'SMBs', geography: ['Indonesia', 'International'], platforms: ['Pinterest', 'Instagram', 'TikTok', 'YouTube', 'Facebook'], cadence: 'Flexible', usp: null}),
      created_at: now,
      updated_at: now
    });
    appendAudit_('ws_studionline', 'SYSTEM', 'setup', 'WORKSPACE_CREATED', 'Workspace', 'ws_studionline', {source: 'setupAgencyOS'});
  }

  return {
    ok: true,
    databaseId: dbId,
    databaseUrl: ss.getUrl(),
    sheets: Object.keys(AGENCY_OS.SHEETS),
    message: 'Database initialized. Gemini gateway is configured for low-cost mode; workers remain paused until an API key is added and enableAgencyWorkers() is run.'
  };
}

function apiGetDashboard(workspaceId) {
  const workspaces = readRows_('Workspaces').filter(function(w) { return w.status === 'ACTIVE'; });
  const selectedId = workspaceId || 'ws_studionline';
  requireWorkspace_(selectedId);
  const tasks = readRows_('Tasks').filter(function(t) { return t.workspace_id === selectedId; });
  const recent = tasks.slice(-12).reverse();
  const counts = {total: tasks.length, queued: 0, running: 0, blocked: 0, failed: 0, completed: 0};
  tasks.forEach(function(task) {
    const s = String(task.execution_status || '').toUpperCase();
    if (s === 'QUEUED') counts.queued++;
    else if (s === 'RUNNING' || s === 'CLAIMED') counts.running++;
    else if (s === 'BLOCKED') counts.blocked++;
    else if (s === 'FAILED') counts.failed++;
    else if (s === 'SUCCEEDED') counts.completed++;
  });
  const approvals = tasks.filter(function(t) { return t.execution_status === 'WAITING_APPROVAL'; }).map(function(t) { return {task_id: t.task_id, title: t.title, department: t.department, output_json: t.output_json, updated_at: t.updated_at}; });
  const workerStatus = agencyWorkerStatus();
  return {ok: true, workspaceId: selectedId, workspaces: workspaces, counts: counts, tasks: recent, approvals: approvals, runtime: {aiGateway: PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') ? 'CONFIGURED' : 'API_KEY_REQUIRED', provider: 'gemini', model: workerStatus.model, worker: workerStatus.worker, triggerInstalled: workerStatus.triggerInstalled, externalActions: 'DISABLED'}};
}

function apiCreateWorkspace(input) {
  input = input || {};
  const name = String(input.name || '').trim();
  const type = String(input.type || 'CLIENT').toUpperCase();
  if (!name) throw new Error('Workspace name is required.');
  if (!['OWNER', 'CLIENT'].includes(type)) throw new Error('Workspace type must be OWNER or CLIENT.');
  if (type === 'OWNER' && readRows_('Workspaces').some(function(w) { return w.type === 'OWNER'; })) {
    throw new Error('An OWNER workspace already exists.');
  }

  return withLock_(function() {
    const now = now_();
    const id = 'ws_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16);
    appendRow_('Workspaces', {
      workspace_id: id, name: name, type: type, status: 'ACTIVE',
      timezone: String(input.timezone || 'Asia/Jakarta'),
      brand_brief_json: JSON.stringify(input.brandBrief || {}),
      created_at: now, updated_at: now
    });
    appendAudit_(id, 'OWNER', 'dashboard', 'WORKSPACE_CREATED', 'Workspace', id, {name: name, type: type});
    return {ok: true, workspaceId: id};
  });
}

function apiCreateTask(input) {
  input = input || {};
  const workspaceId = String(input.workspaceId || 'ws_studionline');
  requireWorkspace_(workspaceId);
  const title = String(input.title || '').trim();
  const department = String(input.department || '').trim();
  if (!title) throw new Error('Task title is required.');
  if (!AGENCY_OS.DEPARTMENTS.includes(department)) throw new Error('Unknown department.');

  return withLock_(function() {
    const now = now_();
    const id = 'task_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16);
    appendRow_('Tasks', {
      task_id: id, workspace_id: workspaceId, project_id: '', campaign_id: '',
      department: department, task_type: String(input.taskType || 'GENERAL'),
      title: title, description: String(input.description || ''),
      priority: String(input.priority || 'NORMAL').toUpperCase(),
      execution_status: 'QUEUED', lifecycle_status: 'IDEA',
      assigned_agent: department, input_json: JSON.stringify(input.payload || {}),
      output_json: '', attempt_count: 0, max_attempts: 3,
      created_at: now, updated_at: now
    });
    appendAudit_(workspaceId, 'OWNER', 'dashboard', 'TASK_CREATED', 'Task', id, {department: department, title: title});
    return {ok: true, taskId: id, executionStatus: 'QUEUED'};
  });
}

function apiCreateWorkflow(input) {
  input = input || {};
  const workspaceId = String(input.workspaceId || 'ws_studionline');
  requireWorkspace_(workspaceId);
  const objective = String(input.objective || '').trim();
  if (!objective) throw new Error('Workflow objective is required.');
  const now = now_();
  const id = 'wf_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16);
  const taskId = 'task_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16);
  const audience = String(input.audience || '');
  const channels = Array.isArray(input.channels) ? input.channels : [];
  appendRow_('Tasks', {
    task_id: taskId, workspace_id: workspaceId, project_id: '', campaign_id: id,
    department: 'Research & Strategy', task_type: 'AGENCY_WORKFLOW',
    title: objective.slice(0, 180),
    description: String(input.context || 'Research the objective, define the strategy, and propose the next internal workflow step.'),
    priority: String(input.priority || 'NORMAL').toUpperCase(),
    execution_status: 'QUEUED', lifecycle_status: 'IDEA',
    assigned_agent: 'Research & Strategy',
    input_json: JSON.stringify({objective: objective, audience: audience, channels: channels, offer: String(input.offer || ''), constraints: String(input.constraints || '')}),
    output_json: '', attempt_count: 0, max_attempts: 3,
    run_after: now, lease_until: '', idempotency_key: id,
    error_message: '', workflow_id: id, parent_task_id: '', step_index: 0,
    created_at: now, updated_at: now
  });
  appendAudit_(workspaceId, 'OWNER', 'dashboard', 'WORKFLOW_CREATED', 'Workflow', id, {objective: objective, first_task_id: taskId});
  return {ok: true, workflowId: id, firstTaskId: taskId, status: 'QUEUED'};
}

function apiDecideTaskApproval(taskId, decision) {
  const id = String(taskId || '');
  const choice = String(decision || '').toUpperCase();
  if (!id || !['APPROVE', 'REJECT'].includes(choice)) throw new Error('A task ID and APPROVE or REJECT decision are required.');
  return withLock_(function() {
    const task = readRows_('Tasks').find(function(row) { return row.task_id === id; });
    if (!task) throw new Error('Task not found.');
    if (task.execution_status !== 'WAITING_APPROVAL') throw new Error('Task is not waiting for approval.');
    const output = safeJson_(task.output_json);
    const payload = JSON.stringify(output);
    const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payload, Utilities.Charset.UTF_8);
    const hash = digest.map(function(byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
    const now = now_();
    appendRow_('Approvals', {
      approval_id: 'apr_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16),
      workspace_id: task.workspace_id, task_id: id, payload_hash: hash,
      decision: choice, decided_by: 'OWNER', decided_at: now, created_at: now
    });
    if (choice === 'APPROVE') {
      updateTaskStatusFromApproval_(id, 'SUCCEEDED', now);
      if (output.next_department && output.next_task_title) createFollowupTask_(task, output);
    } else {
      updateTaskStatusFromApproval_(id, 'REJECTED', now);
    }
    appendAudit_(task.workspace_id, 'OWNER', 'dashboard', 'TASK_' + choice, 'Task', id, {payload_hash: hash});
    return {ok: true, taskId: id, decision: choice, payloadHash: hash};
  });
}

function updateTaskStatusFromApproval_(taskId, status, timestamp) {
  const sheet = getDatabase_().getSheetByName('Tasks');
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const idIndex = headers.indexOf('task_id');
  const statusIndex = headers.indexOf('execution_status');
  const updatedIndex = headers.indexOf('updated_at');
  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idIndex]) === String(taskId)) {
      sheet.getRange(r + 1, statusIndex + 1).setValue(status);
      sheet.getRange(r + 1, updatedIndex + 1).setValue(timestamp);
      return;
    }
  }
  throw new Error('Task not found while applying approval.');
}

function apiListWorkspaces() {
  return {ok: true, workspaces: readRows_('Workspaces').filter(function(w) { return w.status === 'ACTIVE'; })};
}

function apiListTasks(workspaceId) {
  const id = workspaceId || 'ws_studionline';
  requireWorkspace_(id);
  return {ok: true, tasks: readRows_('Tasks').filter(function(t) { return t.workspace_id === id; }).reverse()};
}

function ensureHeaders_(sheet, requiredHeaders) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, requiredHeaders.length).setValues([requiredHeaders]);
    sheet.setFrozenRows(1);
    return;
  }
  const existing = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0].map(String);
  const missing = requiredHeaders.filter(function(header) { return existing.indexOf(header) === -1; });
  if (missing.length) sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]);
  sheet.setFrozenRows(1);
}

function getDatabase_() {
  const id = PropertiesService.getScriptProperties().getProperty(AGENCY_OS.DB_PROPERTY);
  if (!id) throw new Error('Database not initialized. Run setupAgencyOS() once from the Apps Script editor.');
  return SpreadsheetApp.openById(id);
}

function readRows_(sheetName) {
  const sheet = getDatabase_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(String);
  return values.filter(function(row) { return row.some(function(cell) { return cell !== ''; }); })
    .map(function(row) {
      const obj = {};
      headers.forEach(function(header, index) {
        const value = row[index];
        obj[header] = value instanceof Date ? value.toISOString() : value;
      });
      return obj;
    });
}

function appendRow_(sheetName, record) {
  const sheet = getDatabase_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() === 0) throw new Error('Sheet is missing or has no header row: ' + sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  sheet.appendRow(headers.map(function(header) {
    return record[header] === undefined ? '' : record[header];
  }));
}

function appendAudit_(workspaceId, actorType, actorId, eventType, entityType, entityId, details) {
  appendRow_('AuditLog', {
    event_id: 'evt_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16),
    workspace_id: workspaceId, actor_type: actorType, actor_id: actorId,
    event_type: eventType, entity_type: entityType, entity_id: entityId,
    details_json: JSON.stringify(details || {}), created_at: now_()
  });
}

function requireWorkspace_(workspaceId) {
  const found = readRows_('Workspaces').some(function(w) {
    return w.workspace_id === workspaceId && w.status === 'ACTIVE';
  });
  if (!found) throw new Error('Workspace not found or inactive: ' + workspaceId);
}

function withLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try { return callback(); } finally { lock.releaseLock(); }
}

function now_() {
  return new Date().toISOString();
}
