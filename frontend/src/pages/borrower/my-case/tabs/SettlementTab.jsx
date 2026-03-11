import { useState } from 'react'
const MOCK_SETTLEMENT_TASK_SUMMARY = {};
const MOCK_SETTLEMENT_GROUPS = [];
import ProgressBar from '../../components/ProgressBar'

const BellIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
)
const ChevronDown = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
)
const ChevronUp = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
)

function priorityClass(priority) {
  switch (priority?.toLowerCase()) {
    case 'critical': return 'bg-red-100 text-red-700'
    case 'high': return 'bg-amber-100 text-amber-700'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function statusClass(status) {
  switch (status) {
    case 'In Progress': return 'bg-blue-100 text-blue-700'
    case 'Completed': return 'bg-green-100 text-green-700'
    case 'Not Started': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export default function SettlementTab({ settlement: settlementProp, caseId }) {
  const summary = settlementProp && typeof settlementProp.completed === 'number'
    ? settlementProp
    : MOCK_SETTLEMENT_TASK_SUMMARY
  const groups = settlementProp?.groups || MOCK_SETTLEMENT_GROUPS

  const [subTab, setSubTab] = useState('overview') // 'overview' | 'pexa'
  const [aiAssistantActive, setAiAssistantActive] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState({ legal: true, financial: true, documentation: true, 'property-inspection': false, compliance: false, 'party-communication': false })
  const [taskChecked, setTaskChecked] = useState({}) // id -> boolean

  const toggleGroup = (id) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }
  const toggleTask = async (id) => {
    const next = !taskChecked[id]
    setTaskChecked((prev) => ({ ...prev, [id]: next }))
    if (caseId) {
      try {
        await borrowerApi.updateSettlementTask(caseId, id, { completed: next })
      } catch {
        setTaskChecked((prev) => ({ ...prev, [id]: !next }))
      }
    }
  }

  const completed = summary.completed ?? 6
  const total = summary.total ?? 18
  const inProgress = summary.inProgress ?? 5
  const overdue = summary.overdue ?? 0
  const blocked = summary.blocked ?? 0
  const estCompletion = summary.estimatedCompletion ?? '08 Mar 2026'
  const daysRemaining = summary.daysRemaining ?? 5
  const progressPct = total ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Sub-navigation: AI Checklist Manager, Settlement Overview, PEXA Settlement */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={subTab === 'overview'}
            onChange={() => setSubTab('overview')}
            className="rounded border-gray-300 text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">AI Checklist Manager</span>
        </label>
        <button
          type="button"
          onClick={() => setSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${subTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
        >
          <span>Settlement Overview</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('pexa')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${subTab === 'pexa' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
        >
          PEXA Settlement
        </button>
      </div>

      {subTab === 'pexa' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">PEXA Settlement view — connect to PEXA workspace when ready.</p>
          <p className="text-sm text-gray-400 mt-2">Case: {caseId}</p>
        </div>
      )}

      {subTab === 'overview' && (
        <>
          {/* Task summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completed}/{total}</p>
              <ProgressBar value={progressPct} color="blue" />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-500 text-lg">⊞</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{blocked}</p>
                <p className="text-sm text-gray-600">Blocked</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-700">Estimated Completion</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{estCompletion}</p>
              <p className="text-sm text-gray-500">{daysRemaining} days</p>
            </div>
          </div>

          {/* AI Settlement Assistant */}
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">AI Settlement Assistant</h3>
                  <p className="text-sm text-gray-500">Automate task creation, assignments, and communications.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">+ Add Task</button>
                <button type="button" className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Generate Tasks</button>
                <button type="button" className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Auto-Assign</button>
                <button type="button" className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">Optimize Timeline</button>
                <button
                  type="button"
                  onClick={() => setAiAssistantActive(!aiAssistantActive)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg ${aiAssistantActive ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  AI Assistant
                </button>
              </div>
            </div>
          </div>

          {/* Critical / Due Soon highlight cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-8 h-8 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                <p className="text-sm font-semibold text-amber-900">Critical Tasks</p>
                <p className="text-lg font-bold text-amber-800">5 critical tasks pending</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
              <svg className="w-8 h-8 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="text-sm font-semibold text-amber-900">Due Soon</p>
                <p className="text-lg font-bold text-amber-800">8 tasks due in 3 days</p>
              </div>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="space-y-2">
            {groups.map((group) => {
              const isOpen = expandedGroups[group.id] !== false
              return (
                <div key={group.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span className="text-base font-semibold text-gray-900 shrink-0">{group.title}</span>
                      <span className="text-sm text-gray-500 shrink-0">({group.completed}/{group.total} completed — {group.progressPct}%)</span>
                      <div className="hidden sm:block w-24 shrink-0">
                        <ProgressBar value={group.progressPct} color="blue" />
                      </div>
                    </div>
                    <span className="shrink-0 ml-2">{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-200 px-5 pb-4">
                      <ul className="space-y-2 pt-2">
                        {group.tasks.map((task) => {
                          const isChecked = taskChecked[task.id] !== undefined ? taskChecked[task.id] : task.completed
                          return (
                            <li
                              key={task.id}
                              className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0"
                            >
                              <input
                                type="checkbox"
                                checked={!!isChecked}
                                onChange={() => toggleTask(task.id)}
                                className="rounded border-gray-300 text-blue-600 h-4 w-4 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${priorityClass(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                  {task.status && (
                                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${statusClass(task.status)}`}>
                                      {task.status}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500">Assigned to {task.assignee}</span>
                                  <span className="text-xs text-gray-500">Due {task.due}</span>
                                  {task.overdue !== undefined && (
                                    <span className={`text-xs ${task.overdue > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                      {task.overdue > 0 ? `${task.overdue} days` : task.overdue < 0 ? `${Math.abs(task.overdue)} days ago` : 'Today'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600 shrink-0" aria-label="Notifications">
                                <BellIcon />
                              </button>
                              <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700 shrink-0">
                                Details
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
