import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Calendar,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  User,
  Flag,
  MessageSquare,
  Folder
} from 'lucide-react';
import { useStore, Task } from '../store/useStore';
import { cn } from '../lib/utils';
import EmptyState from '../components/EmptyState';

export default function AdminTasksPage() {
  const { tasks, users, projects, addTask, updateTask, deleteTask, currentUser } = useStore();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assigneeIds: [] as string[],
    dueDate: '2026-06-15',
    status: 'todo' as Task['status']
  });

  // FILTER TASKS BASED ON ROLE
  const tasksToDisplay = currentUser?.role === 'admin' 
    ? tasks 
    : tasks.filter(t => (t.assigneeIds || []).includes(currentUser?.id || ''));

  const filteredTasks = tasksToDisplay.filter(t => 
    (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: 'todo', name: 'To Do', icon: Clock },
    { id: 'in-progress', name: 'In Progress', icon: LayoutGrid },
    { id: 'in-review', name: 'In Review', icon: Filter },
    { id: 'done', name: 'Done', icon: CheckCircle2 },
  ];

  const [isAssignMemberOpen, setIsAssignMemberOpen] = useState(false);
  const [taskToAssignMember, setTaskToAssignMember] = useState<Task | null>(null);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask(editingTask.id, {
        ...newTask,
      });
      setEditingTask(null);
    } else {
      const task: Task = {
        id: Math.random().toString(36).substr(2, 9),
        ...newTask,
        projectId: 'p-rag', // Use a valid mock project ID
        createdAt: new Date().toISOString(),
        tags: []
      };
      addTask(task);
    }
    setIsAddTaskOpen(false);
    setNewTask({ title: '', description: '', priority: 'medium', assigneeIds: [], dueDate: '2026-06-15', status: 'todo' });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assigneeIds: task.assigneeIds,
      dueDate: task.dueDate,
      status: task.status
    });
    setIsAddTaskOpen(true);
  };

  const handleToggleMemberForTask = (memberId: string) => {
    if (!taskToAssignMember) return;
    const currentIds = taskToAssignMember.assigneeIds || [];
    const newIds = currentIds.includes(memberId)
      ? currentIds.filter(id => id !== memberId)
      : [...currentIds, memberId];
    
    updateTask(taskToAssignMember.id, { assigneeIds: newIds });
  };

  return (
    <div className="space-y-12 pb-12 font-sans">
      <AnimatePresence>
        {isAssignMemberOpen && taskToAssignMember && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsAssignMemberOpen(false)}
               className="absolute inset-0 bg-black/95 backdrop-blur-md"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-lg bg-app-surface border border-app-border rounded-[2.5rem] overflow-hidden p-8 relative z-10"
             >
                <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-display font-bold tracking-tight text-app-fg text-center">Assign Agent</h3>
                      <p className="text-app-fg/40 text-xs mt-1 text-center">Select an agent for signal: {taskToAssignMember.title}</p>
                    </div>
                    <button onClick={() => setIsAssignMemberOpen(false)} className="text-app-fg/20 hover:text-app-fg transition-colors">
                       <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                  {users.filter(u => u.role === 'member').map(member => {
                    const isSelected = (taskToAssignMember?.assigneeIds || []).includes(member.id);
                    return (
                      <button
                        key={member.id}
                        onClick={() => handleToggleMemberForTask(member.id)}
                        className={cn(
                            "w-full p-4 border rounded-2xl text-left transition-all group flex items-center gap-4",
                            isSelected 
                                ? "bg-brand-gold border-brand-gold/50 shadow-lg shadow-brand-gold/5" 
                                : "bg-app-fg/[0.02] border-app-border hover:border-brand-gold/30 hover:bg-app-fg/[0.04]"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full border border-app-border p-0.5 bg-black">
                          <img src={member.avatar} alt="" className="w-full h-full rounded-full" />
                        </div>
                        <div className="flex-1">
                          <h4 className={cn("font-bold transition-colors", isSelected ? "text-brand-black" : "text-app-fg group-hover:text-brand-gold")}>{member.name}</h4>
                          <span className={cn("text-[10px] uppercase tracking-widest font-bold", isSelected ? "text-brand-black/40" : "text-app-fg/20")}>{member.role}</span>
                        </div>
                        {isSelected ? <X className="w-4 h-4 text-brand-black" /> : <Plus className="w-4 h-4 text-app-fg/10 group-hover:text-brand-gold transition-colors" />}
                      </button>
                    );
                  })}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddTaskOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsAddTaskOpen(false)}
               className="absolute inset-0 bg-black/95 backdrop-blur-sm"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-xl bg-app-surface border border-app-border rounded-[2.5rem] overflow-hidden p-8 relative z-10"
             >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-display font-bold tracking-tight text-app-fg">
                        {editingTask ? 'Update Signal' : 'Initialize Task'}
                    </h3>
                    <button onClick={() => setIsAddTaskOpen(false)} className="p-2 glass rounded-full hover:bg-app-fg/10 transition-all text-app-fg/40">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-app-fg/20 ml-2">Task Sequence</label>
                        <input 
                            required
                            value={newTask.title}
                            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            placeholder="Enter task objective..."
                            className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-gold/30 transition-all text-app-fg"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-app-fg/20 ml-2">Contextual Data</label>
                        <textarea 
                            value={newTask.description}
                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            placeholder="Detail the operation parameters..."
                            className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-gold/30 transition-all min-h-[100px] resize-none text-app-fg"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-app-fg/20 ml-2">Priority Cluster</label>
                            <select 
                                value={newTask.priority}
                                onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                                className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-gold/30 transition-all appearance-none text-app-fg"
                            >
                                <option value="low" className="bg-app-surface">Low Priority</option>
                                <option value="medium" className="bg-app-surface">Medium Priority</option>
                                <option value="high" className="bg-app-surface">High Priority</option>
                                <option value="critical" className="bg-app-surface">Critical Path</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-app-fg/20 ml-2">Current Phase</label>
                            <select 
                                value={newTask.status}
                                onChange={(e) => setNewTask({...newTask, status: e.target.value as any})}
                                className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl p-4 text-sm focus:outline-none focus:border-brand-gold/30 transition-all appearance-none text-app-fg"
                            >
                                <option value="todo" className="bg-app-surface">To Do</option>
                                <option value="in-progress" className="bg-app-surface">In Progress</option>
                                <option value="in-review" className="bg-app-surface">Under Review</option>
                                <option value="done" className="bg-app-surface">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-app-fg/20 ml-2">Assign Agents</label>
                        <div 
                            onClick={() => setIsMemberSelectorOpen(!isMemberSelectorOpen)}
                            className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl p-4 text-sm flex flex-wrap gap-2 cursor-pointer hover:border-brand-gold/30 transition-all min-h-[56px] items-center"
                        >
                            {(newTask.assigneeIds || []).length === 0 ? (
                                <span className="text-app-fg/20">Select team members...</span>
                            ) : (
                                (newTask.assigneeIds || []).map(id => {
                                    const user = users.find(u => u.id === id);
                                    return (
                                        <div key={id} className="bg-brand-gold text-brand-black px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                                            {user?.name}
                                            <X 
                                                className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setNewTask({...newTask, assigneeIds: newTask.assigneeIds.filter(idx => idx !== id)});
                                                }}
                                            />
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <AnimatePresence>
                            {isMemberSelectorOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsMemberSelectorOpen(false)} 
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute z-50 left-0 right-0 mt-2 bg-app-surface border border-app-border rounded-2xl overflow-hidden shadow-2xl max-h-[300px] overflow-y-auto no-scrollbar"
                                    >
                                        <div className="p-2 space-y-1">
                                            {users.filter(u => u.role === 'member').map(user => {
                                                const isSelected = (newTask.assigneeIds || []).includes(user.id);
                                                return (
                                                    <button
                                                        key={user.id}
                                                        type="button"
                                                        onClick={() => {
                                                            const ids = isSelected
                                                                ? newTask.assigneeIds.filter(id => id !== user.id)
                                                                : [...newTask.assigneeIds, user.id];
                                                            setNewTask({...newTask, assigneeIds: ids});
                                                        }}
                                                        className={cn(
                                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                                                            isSelected ? "bg-brand-gold text-brand-black" : "text-app-fg/60 hover:bg-app-fg/5"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full border border-app-border">
                                                                <img src={user.avatar} className="w-full h-full rounded-full" alt="" />
                                                            </div>
                                                            <span className="font-bold text-sm">{user.name}</span>
                                                        </div>
                                                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full py-4 bg-[#f5e6c8] text-brand-black font-bold rounded-2xl hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-brand-gold/5">
                            {editingTask ? 'Apply Signal Update' : 'Initialize Signal'}
                        </button>
                    </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTaskForModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedTaskForModal(null)}
               className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
               layoutId={`task-${selectedTaskForModal.id}`}
               className="w-full max-w-2xl bg-app-surface border border-app-border rounded-[3rem] p-12 relative z-10 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] pointer-events-none" />
                
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-app-border bg-app-fg/5",
                            selectedTaskForModal.priority === 'critical' || selectedTaskForModal.priority === 'high' ? "text-red-500" : "text-[#f5e6c8]"
                        )}>
                            {selectedTaskForModal.status}
                        </div>
                        <div className="h-4 w-px bg-app-border" />
                        <span className="text-[10px] uppercase tracking-widest text-app-fg/20 font-bold">Signal Details</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => {
                                setTaskToAssignMember(selectedTaskForModal);
                                setIsAssignMemberOpen(true);
                            }}
                            className="px-4 py-2 bg-brand-gold/10 text-brand-gold text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-brand-gold/20 transition-all border border-brand-gold/20"
                        >
                            Add Members
                        </button>
                        <button onClick={() => setSelectedTaskForModal(null)} className="p-2 text-app-fg/20 hover:text-app-fg transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <h2 className="text-4xl font-display font-medium mb-2 tracking-tight text-app-fg">{selectedTaskForModal.title}</h2>
                <div className="flex items-center gap-2 mb-8">
                    <Folder className="w-3.5 h-3.5 text-brand-gold/60" />
                    <span className="text-xs font-bold text-app-fg/40 uppercase tracking-widest">
                        {projects.find(p => p.id === selectedTaskForModal.projectId)?.name || 'General Project'}
                    </span>
                </div>
                <p className="text-app-fg/40 text-lg font-medium leading-relaxed mb-10">{selectedTaskForModal.description || 'No detailed data available for this signal.'}</p>
                
                <div className="grid grid-cols-2 gap-12 mb-12 border-t border-b border-app-border py-10">
                    <div className="space-y-3">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-app-fg/20">Assignees</p>
                        <div className="flex flex-wrap items-center gap-2">
                            {(selectedTaskForModal.assigneeIds || []).map(id => {
                                const user = users.find(u => u.id === id);
                                return (
                                    <div key={id} className="flex items-center gap-2 bg-app-fg/5 pr-3 rounded-full border border-app-border">
                                        <div className="w-8 h-8 rounded-full border border-app-border p-1">
                                            <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} alt="" className="w-full h-full rounded-full" />
                                        </div>
                                        <span className="text-xs font-bold text-app-fg">{user?.name || 'Unknown'}</span>
                                    </div>
                                );
                            })}
                            {(selectedTaskForModal.assigneeIds || []).length === 0 && <span className="text-app-fg/20 text-xs italic">Unassigned</span>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <div className="space-y-3">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-app-fg/20">Due Date</p>
                            <div className="flex items-center gap-3 text-app-fg">
                                <Clock className="w-5 h-5 text-[#f5e6c8]" />
                                <span className="text-base font-bold">{selectedTaskForModal.dueDate}</span>
                            </div>
                        </div>
                        {selectedTaskForModal.tags && selectedTaskForModal.tags.length > 0 && (
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-app-fg/20">Tags</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTaskForModal.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-brand-gold/5 border border-brand-gold/10 rounded-md text-[10px] font-bold text-brand-gold uppercase tracking-tighter">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-4">
                    {currentUser?.role === 'admin' ? (
                        <>
                            <button 
                                onClick={() => {
                                    handleEditTask(selectedTaskForModal);
                                    setSelectedTaskForModal(null);
                                }}
                                className="flex-1 py-5 bg-[#f5e6c8] text-brand-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#f5e6c8]/5"
                            >
                                Edit Signal
                            </button>
                            <button 
                                onClick={() => {
                                    deleteTask(selectedTaskForModal.id);
                                    setSelectedTaskForModal(null);
                                }}
                                className="flex-1 py-5 glass text-red-500 font-bold rounded-2xl hover:bg-red-500/10 transition-all"
                            >
                                Decommission Signal
                            </button>
                        </>
                    ) : (
                        <div className="w-full space-y-4">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-app-fg/20 text-center">Update Operational Status</p>
                            <div className="grid grid-cols-4 gap-2">
                                {['todo', 'in-progress', 'in-review', 'done'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            updateTask(selectedTaskForModal.id, { status: status as any });
                                            setSelectedTaskForModal(null);
                                        }}
                                        className={cn(
                                            "py-3 rounded-xl text-[10px] font-bold uppercase transition-all",
                                            selectedTaskForModal.status === status 
                                                ? "bg-brand-gold text-brand-black" 
                                                : "bg-app-fg/5 text-app-fg/40 hover:bg-app-fg/10"
                                        )}
                                    >
                                        {status.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h2 className="text-5xl font-display font-medium tracking-tight text-app-fg mb-3">Tasks</h2>
          <p className="text-app-fg/40 text-lg font-medium tracking-wide">Manage and track team progress.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#0f0f0f] border border-app-border p-1 rounded-xl">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-2.5 rounded-lg transition-all", view === 'kanban' ? "bg-white/10 text-brand-gold" : "text-app-fg/20 hover:text-app-fg/60")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2.5 rounded-lg transition-all", view === 'list' ? "bg-white/10 text-brand-gold" : "text-app-fg/20 hover:text-app-fg/60")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          
          <button className="p-3 bg-[#0f0f0f] border border-app-border rounded-xl text-app-fg/40 hover:text-app-fg transition-all">
            <Filter className="w-6 h-6" />
          </button>

          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setIsAddTaskOpen(true)}
              className="px-8 py-3.5 bg-[#f5e6c8] text-brand-black font-bold rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#f5e6c8]/5"
            >
              <Plus className="w-5 h-5" />
              <span className="text-base tracking-tight">Initialize Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Centered Search */}
      <div className="max-w-xl mx-0">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-app-fg/20 group-focus-within:text-brand-gold transition-colors" />
          <input 
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-app-border rounded-2xl py-4.5 pl-14 pr-6 text-base focus:outline-none focus:border-brand-gold/30 transition-all font-medium text-app-fg placeholder:text-app-fg/10"
          />
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState 
           title="No tasks detected"
           description="Your cosmic sector is currently silent. Initiate a new task sequence to begin orchestration."
           actionLabel="Initialize First Task"
           onAction={() => setIsAddTaskOpen(true)}
        />
      ) : view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {columns.map((column, idx) => (
            <div key={column.id} className={cn(
              "flex flex-col gap-8 p-8 rounded-[3rem] border transition-all relative overflow-hidden",
              column.id === 'todo' ? "bg-slate-900/40 border-slate-700/30" :
              column.id === 'in-progress' ? "bg-blue-900/20 border-blue-700/30" :
              column.id === 'in-review' ? "bg-orange-900/20 border-orange-700/30" :
              "bg-emerald-900/20 border-emerald-700/30"
            )}>
              <div className="absolute top-0 left-0 w-32 h-32 bg-brand-gold/5 blur-[60px] opacity-20 pointer-events-none" />
              <div className="flex items-center justify-between px-2 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all shadow-lg",
                    column.id === 'todo' ? "bg-slate-800 border-slate-600 text-slate-400" :
                    column.id === 'in-progress' ? "bg-blue-800/40 border-blue-600/40 text-blue-400" :
                    column.id === 'in-review' ? "bg-orange-800/40 border-orange-600/40 text-orange-400" :
                    "bg-emerald-800/40 border-emerald-600/40 text-emerald-400"
                  )}>
                    <column.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-display font-medium tracking-tight text-app-fg">{column.name}</h3>
                    <p className="text-[10px] text-app-fg/20 uppercase tracking-[0.2em] font-bold mt-0.5">Phase 0{idx + 1}</p>
                  </div>
                  <span className="ml-2 px-3 py-1 bg-white/5 rounded-lg text-sm font-bold text-app-fg/40 border border-white/5">
                    {filteredTasks.filter(t => t.status === column.id).length}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setNewTask(prev => ({ ...prev, status: column.id as any }));
                    setIsAddTaskOpen(true);
                  }}
                  className="p-2 glass rounded-xl hover:bg-app-fg/10 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="min-h-[400px] flex flex-col gap-6 relative z-10">
                {filteredTasks.filter(t => t.status === column.id).map((task) => (
                  <div key={task.id}>
                    <TaskCard 
                      task={task} 
                      onAssignMember={(t) => {
                        setTaskToAssignMember(t);
                        setIsAssignMemberOpen(true);
                      }} 
                      onClick={() => setSelectedTaskForModal(task)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-morphism rounded-[2.5rem] overflow-hidden border border-app-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-[10px] uppercase tracking-[0.2em] font-bold text-app-fg/30 bg-app-fg/5">
                <th className="px-8 py-5">Objective</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5">Assignee</th>
                <th className="px-8 py-5">Deadline</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {filteredTasks.map((task) => (
                <tr 
                  key={task.id} 
                  onClick={() => setSelectedTaskForModal(task)}
                  className="border-b border-app-border/40 hover:bg-app-fg/[0.02] transition-all group cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4 text-app-fg">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        task.priority === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                      )} />
                      <span className="font-bold text-base">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] bg-app-fg/5 px-2.5 py-1 rounded-md uppercase font-bold text-app-fg/40 border border-app-border">{task.status}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                      task.priority === 'high' || task.priority === 'critical' ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10'
                    )}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-3">
                        <div className="flex -space-x-3 overflow-hidden">
                            {(task.assigneeIds || []).map((id, idx) => (
                                <div key={id} className="w-9 h-9 rounded-full border border-app-border p-0.5 bg-black" style={{ zIndex: (task.assigneeIds || []).length - idx }}>
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} 
                                        alt="" 
                                        className="w-full h-full rounded-full" 
                                    />
                                </div>
                            ))}
                        </div>
                        <button 
                          onClick={() => {
                            setTaskToAssignMember(task);
                            setIsAssignMemberOpen(true);
                          }}
                          className="text-[10px] font-bold uppercase tracking-widest text-[#f5e6c8] hover:text-[#f5e6c8]/80 transition-colors ml-2"
                        >
                          Add Agent
                        </button>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-app-fg/40 font-medium">{task.dueDate}</td>
                  <td className="px-8 py-6">
                    <button className="p-2 text-app-fg/10 hover:text-app-fg opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, onAssignMember, onClick }: { task: Task, onAssignMember: (task: Task) => void, onClick: () => void }) {
  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        className="bg-[#0f0f0f]/60 border border-app-border p-8 rounded-[2rem] cursor-pointer hover:border-brand-gold/10 hover:bg-[#121212] transition-all group relative"
    >
        <div className="flex justify-between items-start mb-10">
            <div className={cn(
                "px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                task.priority === 'high' || task.priority === 'critical' ? "bg-red-500/10 text-red-500" :
                task.priority === 'medium' ? "bg-orange-500/10 text-orange-500" :
                "bg-green-500/10 text-green-500"
            )}>
                {task.priority}
            </div>
            <button className="text-app-fg/10 group-hover:text-app-fg transition-colors">
                <MoreVertical className="w-5 h-5" />
            </button>
        </div>
        
        <h4 className="font-bold text-xl text-app-fg mb-3 group-hover:text-brand-gold transition-colors leading-tight tracking-tight">{task.title}</h4>
        <p className="text-sm text-app-fg/30 font-medium mb-10 line-clamp-2 leading-relaxed">{task.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-app-border/40">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-app-fg/20">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold font-mono">0</span>
              </div>
              <div className="flex items-center gap-1.5 text-app-fg/20">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">{task.dueDate}</span>
              </div>
            </div>

            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    onAssignMember(task);
                }}
                className="flex -space-x-3 hover:space-x-1 transition-all"
            >
                {(task.assigneeIds || []).map((id, idx) => (
                    <div 
                        key={id} 
                        className="w-10 h-10 rounded-full border-2 border-[#0f0f0f] p-0.5 bg-app-fg/5 hover:border-brand-gold transition-all relative"
                        style={{ zIndex: (task.assigneeIds || []).length - idx }}
                    >
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} 
                            alt="" 
                            className="w-full h-full rounded-full" 
                        />
                    </div>
                ))}
                {(task.assigneeIds || []).length === 0 && (
                    <div className="w-10 h-10 rounded-full border border-dashed border-app-border flex items-center justify-center text-app-fg/20 hover:text-brand-gold transition-colors">
                        <Plus className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    </motion.div>
  );
}
