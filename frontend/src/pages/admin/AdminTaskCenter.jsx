import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    CheckSquare, AlertCircle, Clock, Flag, BarChart2, CheckCircle2,
    Search, Calendar, Plus, Edit2, Trash2, ExternalLink, X
} from "lucide-react";
import { adminTaskService } from '../../api/dataService';
import GlobalDatePicker from '../../components/common/GlobalDatePicker';

export default function AdminTaskCenter() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [priorityFilter, setPriorityFilter] = useState('All Priorities');
    const [moduleFilter, setModuleFilter] = useState('All Modules');
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium', dueDate: '', module: 'Brickbanq' });
    const [sortBy, setSortBy] = useState('Due Date');

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await adminTaskService.listTasks();
            if (res.success) {
                // Map audit logs to task format
                const mapped = res.data.map(log => ({
                    id: log.id,
                    title: log.action || "System Event",
                    description: log.details || `Activity on ${log.module}`,
                    priority: "Medium",
                    status: "Pending",
                    dueDate: "No Date",
                    dueDateObj: new Date(log.created_at),
                    createdAt: new Date(log.created_at),
                    module: log.module || "General",
                    category: log.action_type || "Audit",
                    tags: [log.module?.toLowerCase()],
                    checked: false
                }));
                setTasks(mapped);
            } else {
                setError(res.error || "Failed to fetch tasks");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const activeTasksCount = tasks.filter(t => t.status !== 'Completed').length;
    const overdueCount = tasks.filter(t => t.status === 'Overdue' || t.dueDate.includes('Overdue')).length;
    const dueTodayCount = tasks.filter(t => t.dueDate === 'Today').length;
    const urgentCount = tasks.filter(t => t.priority === 'Urgent').length;
    const inProgressCount = tasks.filter(t => t.status === 'In progress').length;
    const completedCount = tasks.filter(t => t.status === 'Completed').length;

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.caseNumber && task.caseNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
            task.tags.some(tag => tag && tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = statusFilter === 'All Status' ||
            (statusFilter === 'Completed' && task.status === 'Completed') ||
            (statusFilter === 'Pending' && task.status === 'Pending') ||
            (statusFilter === 'In progress' && task.status === 'In progress') ||
            (statusFilter === 'Overdue' && (task.status === 'Overdue' || (task.dueDate && task.dueDate.includes('Overdue')))) ||
            (statusFilter === 'Due Today' && task.dueDate === 'Today');
            
        const matchesPriority = priorityFilter === 'All Priorities' || (priorityFilter === 'Urgent' && task.priority === 'Urgent') || task.priority === priorityFilter;
        const matchesModule = moduleFilter === 'All Modules' || task.module === moduleFilter;
        
        return matchesSearch && matchesStatus && matchesPriority && matchesModule;
    }).sort((a, b) => {
        if (sortBy === 'Due Date') return a.dueDateObj - b.dueDateObj;
        if (sortBy === 'Priority') { const pMap = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 }; return pMap[a.priority] - pMap[b.priority]; }
        if (sortBy === 'Status') { const sMap = { 'Overdue': 0, 'In progress': 1, 'Pending': 2, 'Completed': 3 }; return sMap[a.status] - sMap[b.status]; }
        if (sortBy === 'Created') return b.createdAt - a.createdAt;
        return 0;
    });

    const toggleTaskCheck = (id) => {
        setTasks((tasks || []).map(t => {
            if (t?.id === id) return { ...t, checked: !t.checked, status: !t.checked ? 'Completed' : 'Pending' };
            return t;
        }));
    };

    const handleEditTask = (task) => { setEditingTask(task); setIsEditModalOpen(true); };
    const handleDeleteTask = (id) => { if (window.confirm('Are you sure you want to delete this task?')) setTasks(tasks.filter(t => t.id !== id)); };
    const handleUpdateTask = (e) => { e.preventDefault(); setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t)); setIsEditModalOpen(false); setEditingTask(null); };

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        const newTaskObj = { 
            id: Date.now(), 
            title: newTask.title, 
            description: newTask.description, 
            priority: newTask.priority, 
            status: 'Pending', 
            dueDate: newTask.dueDate ? new Date(newTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date', 
            dueDateObj: newTask.dueDate ? new Date(newTask.dueDate) : new Date(), 
            createdAt: new Date(), 
            module: newTask.module, 
            category: 'Other', 
            tags: [newTask.module.toLowerCase()], 
            checked: false 
        };
        setTasks([newTaskObj, ...tasks]);
        setIsNewTaskModalOpen(false);
        setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '', module: 'Brickbanq' });
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading tasks...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#0F172A] mb-1">Task Center</h1>
                    <p className="text-[#64748B] text-xs sm:text-sm">Manage all your administrative tasks across the platform</p>
                </div>
                <button onClick={() => setIsNewTaskModalOpen(true)} className="bg-[#2D31A6] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 hover:bg-[#232685] transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                    <Plus size={16} /> New Task
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {[
                    { count: activeTasksCount, label: 'Active Tasks', color: '#1C4ED8', bgColor: 'blue', Icon: CheckSquare, activeFilter: statusFilter === 'All Status' && priorityFilter === 'All Priorities', onClick: () => { setStatusFilter('All Status'); setPriorityFilter('All Priorities'); } },
                    { count: overdueCount, label: 'Overdue', color: '#EF4444', bgColor: 'red', Icon: AlertCircle, activeFilter: statusFilter === 'Overdue', onClick: () => setStatusFilter('Overdue') },
                    { count: dueTodayCount, label: 'Due Today', color: '#F97316', bgColor: 'orange', Icon: Clock, activeFilter: statusFilter === 'Due Today', onClick: () => setStatusFilter('Due Today') },
                    { count: urgentCount, label: 'Urgent', color: '#8B5CF6', bgColor: 'purple', Icon: Flag, activeFilter: priorityFilter === 'Urgent', onClick: () => { setPriorityFilter('Urgent'); setStatusFilter('All Status'); } },
                    { count: inProgressCount, label: 'In Progress', color: '#3B82F6', bgColor: 'blue', Icon: BarChart2, activeFilter: statusFilter === 'In progress', onClick: () => setStatusFilter('In progress') },
                    { count: completedCount, label: 'Completed', color: '#10B981', bgColor: 'emerald', Icon: CheckCircle2, activeFilter: statusFilter === 'Completed', onClick: () => setStatusFilter('Completed') },
                ].map(({ count, label, color, bgColor, Icon, activeFilter, onClick }) => (
                    <button key={label} onClick={onClick}
                        className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between text-left hover:shadow-md ${activeFilter ? 'border-indigo-600 shadow-sm' : 'border-gray-100'}`}
                        style={{ borderColor: activeFilter ? color : undefined }}>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black mb-0.5 sm:mb-1" style={{ color }}>{count}</h3>
                            <p className="text-[10px] sm:text-xs font-semibold text-gray-500">{label}</p>
                        </div>
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-${bgColor}-50 flex items-center justify-center border border-${bgColor}-100`}>
                            <Icon size={18} style={{ color }} />
                        </div>
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative">
                        <label className="block text-[11px] font-bold text-gray-900 mb-1.5 pl-1">Search Tasks</label>
                        <div className="relative flex items-center">
                            <Search size={14} className="absolute left-3.5 text-gray-400" />
                            <input type="text" placeholder="Search by title, case number, or tags..." className="w-full pl-9 pr-4 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#1C4ED8] focus:ring-1 focus:ring-[#1C4ED8] transition-colors" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                    {[
                        { label: 'Status', value: statusFilter, onChange: setStatusFilter, options: ['All Status', 'Pending', 'In progress', 'Overdue', 'Completed', 'Due Today'] },
                        { label: 'Priority', value: priorityFilter, onChange: setPriorityFilter, options: ['All Priorities', 'Low', 'Medium', 'High', 'Urgent'] },
                        { label: 'Module', value: moduleFilter, onChange: setModuleFilter, options: ['All Modules', 'Accounting', 'Brickbanq', 'Crm', 'Compliance'] },
                    ].map(({ label, value, onChange, options }) => (
                        <div key={label}>
                            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 pl-1">{label}</label>
                            <select className="w-full px-3 py-2 text-[13px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#1C4ED8] focus:ring-1 focus:ring-[#1C4ED8] transition-colors bg-white font-medium" value={value} onChange={(e) => onChange(e.target.value)}>
                                {options.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pt-4 border-t border-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span className="text-[12px] font-bold text-gray-700">Sort by:</span>
                        <div className="flex flex-wrap gap-1.5">
                            {[['Due Date', Calendar], ['Priority', Flag], ['Status', CheckSquare], ['Created', Clock]].map(([label, Icon]) => (
                                <button key={label} onClick={() => setSortBy(label)}
                                    className={`px-3 py-1.5 text-[12px] font-bold rounded-md flex items-center gap-1.5 transition-colors ${sortBy === label ? 'bg-[#2D31A6] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                                    <Icon size={13} /> {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <span className="text-[12px] text-gray-500 font-medium pb-1 xl:pb-0">Showing {filteredTasks.length} of {tasks.length} tasks</span>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.map(task => (
                    <div key={task.id} className={`bg-white rounded-2xl border transition-shadow hover:shadow-md ${task.checked ? 'border-gray-100 opacity-70' : 'border-gray-200 shadow-sm'}`}>
                        <div className="flex flex-col md:flex-row md:items-start justify-between p-4 sm:p-5 gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <button onClick={() => toggleTaskCheck(task.id)} className={`w-5 h-5 mt-1 rounded border flex items-center justify-center transition-colors shrink-0 ${task.checked ? 'bg-[#60A5FA] border-[#60A5FA]' : 'bg-gray-200/50 border-gray-300 hover:bg-gray-200'}`}>
                                    {task.checked && <CheckSquare size={14} className="text-white" />}
                                </button>
                                <div className="flex-1">
                                    <h3 className={`text-[15px] sm:text-[16px] font-bold mb-1 tracking-tight ${task.checked ? 'text-gray-400 line-through' : 'text-[#1E293B]'}`}>{task.title}</h3>
                                    <p className={`text-[12px] sm:text-[13px] mb-3 ${task.checked ? 'text-gray-400' : 'text-gray-500'}`}>{task.description}</p>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold border ${task.priority === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100' : task.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' : task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} ${task.checked ? 'opacity-50' : ''}`}>
                                            <Flag size={10} />{task.priority}
                                        </span>
                                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-extrabold border ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : task.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : task.status === 'In progress' ? 'bg-blue-50 text-[#1C4ED8] border-blue-100' : 'bg-gray-50 text-gray-700 border-gray-200'} ${task.checked && task.status !== 'Completed' ? 'opacity-50' : ''}`}>
                                            {task.status === 'Completed' ? <CheckCircle2 size={10} /> : <Clock size={10} />}{task.status}
                                        </span>
                                        <div className="relative group">
                                            <GlobalDatePicker 
                                                value={task.dueDateObj}
                                                onChange={(e) => {
                                                    const newDate = e.target.value;
                                                    setTasks(tasks.map(t => t.id === task.id ? { 
                                                        ...t, 
                                                        dueDate: new Date(newDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                                        dueDateObj: new Date(newDate)
                                                    } : t));
                                                }}
                                                className="!w-auto"
                                                inputClassName="!h-auto !p-0 !bg-transparent !border-none !shadow-none !text-[11px] !sm:text-[12px] !font-bold !cursor-pointer hover:!text-blue-600 !w-24"
                                            />
                                            {task.dueDate && task.dueDate.includes('Overdue') && <span className="absolute -top-1 -right-1 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-[#64748B] bg-gray-50 px-2 py-1 rounded">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>{task.module}
                                        </div>
                                    </div>
                                    {(!task.checked && (task.hasStartButton || task.hasMoveAndMarkCompleteButtons)) && (
                                        <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center gap-2 sm:gap-3">
                                            {task.hasStartButton && (<button className="px-4 py-1.5 rounded-lg border border-gray-200 text-[12px] font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">Start Task</button>)}
                                            {task.hasMoveAndMarkCompleteButtons && (<><button className="px-4 py-1.5 rounded-lg border border-gray-200 text-[12px] font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">Move to Pending</button><button onClick={() => toggleTaskCheck(task.id)} className="px-4 py-1.5 rounded-lg text-[12px] font-bold text-white bg-[#2D31A6] hover:bg-[#232685] transition-colors shadow-sm flex items-center gap-1.5"><CheckCircle2 size={13} /> Mark Complete</button></>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end justify-between md:self-stretch gap-3 md:gap-0 pl-9 md:pl-0">
                                <div className="flex items-center gap-2">
                                    {task.caseNumber && (<Link to={`/admin/case-details/${task.caseNumber}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-[11px] sm:text-[12px] font-bold text-gray-700 hover:bg-gray-50 transition-colors mr-1"><ExternalLink size={13} /> View Case</Link>)}
                                    <button onClick={() => handleEditTask(task)} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded border border-gray-200 transition-colors"><Edit2 size={14} /></button>
                                    <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded border border-red-100 transition-colors"><Trash2 size={14} /></button>
                                </div>
                                <div className="flex items-center gap-1.5 sm:mt-auto">
                                    {(task.tags || []).map(tag => tag && (<span key={tag} className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold border ${task.checked ? 'bg-gray-50 text-gray-400 border-gray-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{tag}</span>))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Task Modal */}
            {isNewTaskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden">
                        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
                            <h2 className="text-[15px] font-bold text-[#0F172A]">Create New Task</h2>
                            <button onClick={() => setIsNewTaskModalOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><X size={15} /></button>
                        </div>
                        <form onSubmit={handleCreateTask}>
                            <div className="p-4 space-y-2.5">
                                <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Task Title</label><input type="text" required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="Enter task title..." className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] focus:ring-1 focus:ring-[#1C4ED8] transition-colors" /></div>
                                <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Description</label><textarea rows="2" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} placeholder="Enter task description..." className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] focus:ring-1 focus:ring-[#1C4ED8] transition-colors resize-none"></textarea></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Priority</label><select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })} className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] transition-colors bg-white font-medium shadow-sm">{['Low','Medium','High','Urgent'].map(o => <option key={o}>{o}</option>)}</select></div>
                                    <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Due Date</label><GlobalDatePicker value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} /></div>
                                </div>
                                <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Module</label><select value={newTask.module} onChange={(e) => setNewTask({ ...newTask, module: e.target.value })} className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] transition-colors bg-white font-medium text-gray-700 shadow-sm">{['Brickbanq','Accounting','CRM','Compliance'].map(o => <option key={o}>{o}</option>)}</select></div>
                            </div>
                            <div className="px-5 py-3 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={() => setIsNewTaskModalOpen(false)} className="px-4 py-1.5 text-[12px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
                                <button type="submit" className="px-5 py-1.5 text-[12px] font-bold text-white bg-[#2D31A6] rounded-lg hover:bg-[#232685] transition-colors shadow-sm flex items-center gap-2"><Plus size={15} /> Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Task Modal */}
            {isEditModalOpen && editingTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden">
                        <div className="px-5 py-3 flex items-center justify-between border-b border-gray-100">
                            <h2 className="text-[15px] font-bold text-[#0F172A]">Edit Task</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"><X size={15} /></button>
                        </div>
                        <form onSubmit={handleUpdateTask}>
                            <div className="p-4 space-y-2.5">
                                <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Task Title</label><input type="text" value={editingTask.title} onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })} className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] transition-colors" /></div>
                                <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Description</label><textarea rows="2" value={editingTask.description} onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })} className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] transition-colors resize-none"></textarea></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Priority</label><select value={editingTask.priority} onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })} className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] transition-colors bg-white font-medium">{['Low','Medium','High','Urgent'].map(o => <option key={o}>{o}</option>)}</select></div>
                                    <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Due Date</label><GlobalDatePicker value={editingTask.dueDateObj ? editingTask.dueDateObj.toISOString().split('T')[0] : ''} onChange={(e) => setEditingTask({ ...editingTask, dueDateObj: new Date(e.target.value), dueDate: e.target.value })} /></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Status</label><select value={editingTask.status} onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })} className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] transition-colors bg-white font-medium">{['Pending','In progress','Overdue','Completed'].map(o => <option key={o}>{o}</option>)}</select></div>
                                    <div><label className="block text-[11px] font-bold text-gray-700 mb-0.5">Module</label><select value={editingTask.module} onChange={(e) => setEditingTask({ ...editingTask, module: e.target.value })} className="w-full px-4 py-2 text-[13px] border border-gray-200 rounded-xl focus:outline-none focus:border-[#1C4ED8] transition-colors bg-white font-medium text-gray-700">{['Accounting','Brickbanq','Crm','Compliance'].map(o => <option key={o}>{o}</option>)}</select></div>
                                </div>
                            </div>
                            <div className="px-5 py-3 bg-gray-50 flex items-center justify-end gap-3 border-t border-gray-100">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-1.5 text-[12px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
                                <button type="submit" className="px-5 py-1.5 text-[12px] font-bold text-white bg-[#2D31A6] rounded-lg hover:bg-[#232685] transition-colors shadow-sm flex items-center gap-2"><Edit2 size={15} /> Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
