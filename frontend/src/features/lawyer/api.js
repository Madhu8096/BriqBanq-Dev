/**
 * Lawyer panel API layer. Replace mock implementations with real HTTP/WebSocket calls.
 * All functions return Promises for consistent async handling and backend integration.
 */

import {
  MOCK_USER,
  MOCK_CASES,
  MOCK_CASE_STATS,
  MOCK_CONTRACTS,
  MOCK_TASKS,
  MOCK_TASK_STATS,
  MOCK_NOTIFICATIONS,
  MOCK_NOTIFICATION_STATS,
  MOCK_ESIGNATURE_STATS,
  MOCK_ESIGNATURE_TASKS,
  MOCK_SECURITY_ALERTS,
  MOCK_RECENT_ACTIVITY,
  MOCK_ESIGNATURE_ENVELOPES,
  MOCK_ESIGNATURE_DOCUMENTS,
  MOCK_ESIGNATURE_TEMPLATES,
  MOCK_HSM_CLUSTER,
  MOCK_CERTIFICATES,
  MOCK_EVIDENCE_CHAIN,
  MOCK_EVIDENCE_EVENTS,
  MOCK_ADMIN_DATA_SOVEREIGNTY,
  MOCK_ADMIN_POLICIES,
  MOCK_ADMIN_SECURITY,
  MOCK_DASHBOARD_STATS,
  MOCK_MONTHLY_OVERVIEW,
  MOCK_PLATFORM_STATUS,
  MOCK_RECENT_CASES,
  MOCK_RECENT_SALES,
  MOCK_QUICK_ACTIONS,
} from './data/mockLawyer'
import {
  MOCK_GOVSIGN_STATS,
  MOCK_GOVSIGN_TASKS,
  MOCK_GOVSIGN_ALERTS,
  MOCK_GOVSIGN_ACTIVITY,
  MOCK_GOVSIGN_ENVELOPES,
  MOCK_GOVSIGN_DOCUMENTS,
  MOCK_GOVSIGN_TEMPLATES,
  MOCK_GOVSIGN_HSM_CLUSTER,
  MOCK_GOVSIGN_CERTIFICATES,
  MOCK_GOVSIGN_EVIDENCE_CHAIN,
  MOCK_GOVSIGN_EVIDENCE_EVENTS,
  MOCK_GOVSIGN_ADMIN_SOVEREIGNTY,
  MOCK_GOVSIGN_ADMIN_POLICIES,
  MOCK_GOVSIGN_ADMIN_SECURITY,
  MOCK_GOVSIGN_REPORT_TYPES,
  MOCK_GOVSIGN_REPORTS,
  MOCK_GOVSIGN_HELP_FAQ,
  MOCK_GOVSIGN_HELP_LINKS,
} from './data/mockData'

const delay = (ms = 0) => new Promise((r) => setTimeout(r, ms))

/** Simulate API latency; remove or reduce when using real backend */
const MOCK_DELAY = 0

/** Current user / session. Replace with auth context or API. */
export async function getCurrentUser() {
  await delay(MOCK_DELAY)
  return { data: MOCK_USER, error: null }
}

/** Dashboard overview data */
export async function getDashboardData() {
  await delay(MOCK_DELAY)
  return {
    data: {
      stats: MOCK_DASHBOARD_STATS,
      monthlyOverview: MOCK_MONTHLY_OVERVIEW,
      platformStatus: MOCK_PLATFORM_STATUS,
      recentCases: MOCK_RECENT_CASES,
      recentSales: MOCK_RECENT_SALES,
      quickActions: MOCK_QUICK_ACTIONS,
    },
    error: null,
  }
}

/** Assigned cases list and stats */
export async function getCases(params = {}) {
  await delay(MOCK_DELAY)
  const { search, status } = params
  let list = [...MOCK_CASES]
  if (search) {
    const q = String(search).toLowerCase()
    list = list.filter(
      (c) =>
        (c.caseNumber && c.caseNumber.toLowerCase().includes(q)) ||
        (c.borrower && c.borrower.toLowerCase().includes(q)) ||
        (c.property && c.property.toLowerCase().includes(q))
    )
  }
  if (status && status !== 'All Status') {
    list = list.filter((c) => c.status === status)
  }
  return {
    data: { cases: list, stats: { ...MOCK_CASE_STATS } },
    error: null,
  }
}

/** Contracts list */
export async function getContracts() {
  await delay(MOCK_DELAY)
  return { data: MOCK_CONTRACTS, error: null }
}

/**
 * Create a new contract. Replace with real API call when backend is ready.
 * @param {Object} payload - { propertyAddress, propertySuburb, parties, partiesSub, value, date, status, photoFileNames? }
 * @returns {Promise<{ data?: object, error?: string }>}
 */
export async function createContract(payload) {
  await delay(MOCK_DELAY)
  const id = `MIP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  const contract = {
    id,
    propertyAddress: payload.propertyAddress || '',
    propertySuburb: payload.propertySuburb || '',
    contractId: id,
    parties: payload.parties || '',
    partiesSub: payload.partiesSub || '',
    value: payload.value || '',
    createdDate: payload.date || new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: payload.status || 'Draft',
    statusVariant: payload.status === 'Completed' ? 'green' : 'blue',
  }
  return { data: contract, error: null }
}

/** Tasks and task stats */
export async function getTasks(params = {}) {
  await delay(MOCK_DELAY)
  return {
    data: { tasks: [...MOCK_TASKS], stats: { ...MOCK_TASK_STATS } },
    error: null,
  }
}

/**
 * Create a new task. Replace with real API call when backend is ready.
 * @param {Object} payload - { title, description, priority, dueDate, module }
 * @returns {Promise<{ data?: object, error?: string }>}
 */
export async function createTask(payload) {
  await delay(MOCK_DELAY)
  // Mock: return created task shape. Backend will return the same shape.
  const task = {
    id: `task-${Date.now()}`,
    title: payload.title || 'Untitled Task',
    description: payload.description || '',
    priority: payload.priority || 'Low',
    status: 'Pending',
    dueDate: payload.dueDate || '',
    caseId: payload.caseId || 'Brickbanq',
    module: payload.module || 'Brickbanq',
    completed: false,
  }
  return { data: task, error: null }
}

/** Notifications and notification stats */
export async function getNotifications() {
  await delay(MOCK_DELAY)
  return {
    data: { notifications: [...MOCK_NOTIFICATIONS], stats: { ...MOCK_NOTIFICATION_STATS } },
    error: null,
  }
}

/** E-Signatures page data — all GovSign tabs (legacy) */
export async function getEsignatureData() {
  await delay(MOCK_DELAY)
  return {
    data: {
      stats: MOCK_ESIGNATURE_STATS,
      tasks: MOCK_ESIGNATURE_TASKS,
      alerts: MOCK_SECURITY_ALERTS,
      activity: MOCK_RECENT_ACTIVITY,
      envelopes: MOCK_ESIGNATURE_ENVELOPES,
      documents: MOCK_ESIGNATURE_DOCUMENTS,
      templates: MOCK_ESIGNATURE_TEMPLATES,
      hsmCluster: MOCK_HSM_CLUSTER,
      certificates: MOCK_CERTIFICATES,
      evidenceChain: MOCK_EVIDENCE_CHAIN,
      evidenceEvents: MOCK_EVIDENCE_EVENTS,
      adminSovereignty: MOCK_ADMIN_DATA_SOVEREIGNTY,
      adminPolicies: MOCK_ADMIN_POLICIES,
      adminSecurity: MOCK_ADMIN_SECURITY,
    },
    error: null,
  }
}

/** GovSign full UI data — same shape as borrower ESignatures */
export async function getGovSignData() {
  await delay(MOCK_DELAY)
  return {
    data: {
      stats: MOCK_GOVSIGN_STATS,
      tasks: MOCK_GOVSIGN_TASKS,
      alerts: MOCK_GOVSIGN_ALERTS,
      activity: MOCK_GOVSIGN_ACTIVITY,
      envelopes: [...MOCK_GOVSIGN_ENVELOPES],
      documents: [...MOCK_GOVSIGN_DOCUMENTS],
      templates: [...MOCK_GOVSIGN_TEMPLATES],
      hsmCluster: MOCK_GOVSIGN_HSM_CLUSTER,
      certificates: MOCK_GOVSIGN_CERTIFICATES,
      evidenceChain: MOCK_GOVSIGN_EVIDENCE_CHAIN,
      evidenceEvents: MOCK_GOVSIGN_EVIDENCE_EVENTS,
      adminSovereignty: MOCK_GOVSIGN_ADMIN_SOVEREIGNTY,
      adminPolicies: MOCK_GOVSIGN_ADMIN_POLICIES,
      adminSecurity: MOCK_GOVSIGN_ADMIN_SECURITY,
      reportTypes: MOCK_GOVSIGN_REPORT_TYPES,
      reports: [...MOCK_GOVSIGN_REPORTS],
      helpFaq: MOCK_GOVSIGN_HELP_FAQ,
      helpLinks: MOCK_GOVSIGN_HELP_LINKS,
    },
    error: null,
  }
}
