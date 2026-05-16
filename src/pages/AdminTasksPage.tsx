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
  AlertCircle
} from 'lucide-react';
import { useStore, Task } from '../store/useStore';
import { cn } from '../lib/utils';

export default function AdminTasksPage() {
  const { tasks, users, addTask, updateTask, deleteTask } = useStore();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: 'todo', name: 'Backlog', icon: Clock },
    { id: 'in-progress', name: 'Active', icon: LayoutGrid },
    { id: 'in-review', name: 'Validating', icon: Filter },
    { id: 'done', name: 'Synchronized', icon: CheckCircle2 },
  ];

  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);

  return (
    <div className="space-y-8 pb-12">
      {/* ... prev header code ... */}
      
      <AnimatePresence>
        {selectedTaskForModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTaskForModal(null)}
              className="absolute inset-0 bg-brand-black/80 backdrop-blur-md"
            />
            <motion.div
              layoutId={`task-${selectedTaskForModal.id}`}
              className="w-full max-w-2xl bg-brand-graphite border border-white/10 rounded-[2.5rem] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[100px] pointer-events-none" />
                
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-widest",
                            selectedTaskForModal.priority === 'critical' ? "text-red-500" : "text-brand-purple"
                        )}>
                            {selectedTaskForModal.status}
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Created 2 days ago</span>
                    </div>
                    <button onClick={() => setSelectedTaskForModal(null)} className="p-2 glass rounded-full hover:bg-white/10 transition-all">
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <h2 className="text-3xl font-display font-bold mb-4 tracking-tight">{selectedTaskForModal.title}</h2>
                <p className="text-white/50 font-light leading-relaxed mb-8">{selectedTaskForModal.description}</p>
                
                <div className="grid grid-cols-2 gap-8 mb-12">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">Assignee</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-white/10 p-0.5">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedTaskForModal.assigneeId}`} alt="" className="w-full h-full rounded-full" />
                            </div>
                            <span className="text-sm font-medium">System Contributor x01</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">Due Date</p>
                        <div className="flex items-center gap-3 text-white/80">
                            <Clock className="w-4 h-4 text-brand-purple" />
                            <span className="text-sm font-medium">{selectedTaskForModal.dueDate}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-brand-purple text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all">
                        Mark as Complete
                    </button>
                    <button className="flex-1 py-4 glass text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                        Initiate AI Audit
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tight">Task Command</h2>
          <p className="text-white/40 mt-1 font-light">Global task orchestration across all team clusters.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex glass p-1 rounded-xl">
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-2 rounded-lg transition-all", view === 'kanban' ? "bg-white/10 text-brand-purple" : "text-white/40 hover:text-white")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white/10 text-brand-purple" : "text-white/40 hover:text-white")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button className="px-6 py-3 bg-brand-purple text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-purple transition-colors" />
          <input 
            type="text"
            placeholder="Filter operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple/20 transition-all"
          />
        </div>
        <button className="px-5 py-3 glass rounded-2xl flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
        </button>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <column.icon className="w-4 h-4 text-white/20" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{column.name}</h3>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-white/20">{filteredTasks.filter(t => t.status === column.id).length}</span>
                </div>
              </div>

              <div className="space-y-4">
                {filteredTasks.filter(t => t.status === column.id).map((task) => (
                  <div key={task.id} onClick={() => setSelectedTaskForModal(task)}>
                    <TaskCard task={task} />
                  </div>
                ))}
                <button className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-white/20 text-xs font-bold uppercase tracking-widest hover:border-brand-purple/50 hover:text-white/40 transition-all">
                  + Add Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-morphism rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 bg-white/5">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Assignee</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        task.priority === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                        task.priority === 'high' ? 'bg-orange-500' : 'bg-brand-teal'
                      )} />
                      <span className="font-bold">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] glass px-2 py-1 rounded-md uppercase font-bold text-white/40">{task.status}</span>
                  </td>
                  <td className="px-6 py-4 capitalize">{task.priority}</td>
                  <td className="px-6 py-4">
                     <div className="w-8 h-8 rounded-full border border-white/10 p-0.5">
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId}`} 
                            alt="" 
                            className="w-full h-full rounded-full" 
                        />
                     </div>
                  </td>
                  <td className="px-6 py-4 text-white/40">{task.dueDate}</td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                      <MoreVertical className="w-4 h-4" />
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

function TaskCard({ task }: { task: Task }) {
  return (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-5 rounded-2xl cursor-pointer hover:border-brand-purple/50 hover:bg-white/[0.05] transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={cn(
                "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                task.priority === 'critical' ? "bg-red-500/20 text-red-500" :
                task.priority === 'high' ? "bg-orange-500/20 text-orange-500" :
                "bg-brand-teal/20 text-brand-teal"
            )}>
                {task.priority}
            </div>
            <button className="text-white/10 group-hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
            </button>
        </div>
        
        <h4 className="font-bold text-sm mb-2 group-hover:text-brand-purple transition-colors leading-tight">{task.title}</h4>
        <p className="text-[10px] text-white/30 font-light mb-4 line-clamp-2 leading-relaxed">{task.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
            <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border border-brand-black p-0.5 bg-brand-graphite">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId}`} 
                        alt="" 
                        className="w-full h-full rounded-full" 
                    />
                </div>
            </div>
            <div className="flex items-center gap-1.5 text-white/20">
                <Clock className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">{task.dueDate}</span>
            </div>
        </div>
    </motion.div>
  );
}
