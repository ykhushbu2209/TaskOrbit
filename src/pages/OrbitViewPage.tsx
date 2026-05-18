import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, User } from '../store/useStore';
import OrbitVisualization from '../components/OrbitVisualization';
import { 
  Layers, 
  Zap, 
  Shield, 
  Target, 
  X, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Briefcase,
  LayoutGrid,
  List,
  TrendingUp,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function OrbitViewPage() {
  const { tasks, projects, users } = useStore();
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [view, setView] = useState<'orbit' | 'list'>('orbit');

  const getMemberStats = (userId: string) => {
    const memberTasks = tasks.filter(t => (t.assigneeIds || []).includes(userId));
    const memberProjects = projects.filter(p => 
      (p.teamIds || []).includes(userId) || 
      memberTasks.some(t => t.projectId === p.id)
    );
    const completedTasks = memberTasks.filter(t => t.status === 'done').length;
    const activeTasks = memberTasks.filter(t => t.status !== 'done').length;
    
    // Contribution score formula
    const contributionScore = (completedTasks * 15) + (activeTasks * 5) + (memberProjects.length * 10);
    
    return {
      tasks: memberTasks,
      projects: memberProjects,
      completedCount: completedTasks,
      activeCount: activeTasks,
      score: contributionScore
    };
  };

  const rankedUsers = [...users].sort((a, b) => {
    const statsA = getMemberStats(a.id);
    const statsB = getMemberStats(b.id);
    return statsB.score - statsA.score;
  });

  const selectedMemberStats = selectedMember ? getMemberStats(selectedMember.id) : null;

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tight text-app-fg">Team Dynamics</h2>
          <p className="text-app-fg/40 mt-1 font-light">Visualizing high-performance gravitational fields across the organization.</p>
        </div>
        
        <div className="flex gap-2 bg-app-fg/[0.03] p-1.5 rounded-2xl border border-app-border">
             <button 
                onClick={() => setView('orbit')}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    view === 'orbit' ? "bg-brand-gold text-brand-black shadow-lg" : "text-app-fg/40 hover:text-app-fg"
                )}
             >
                 <LayoutGrid className="w-3.5 h-3.5" />
                 Orbit
             </button>
             <button 
                onClick={() => setView('list')}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    view === 'list' ? "bg-brand-gold text-brand-black shadow-lg" : "text-app-fg/40 hover:text-app-fg"
                )}
             >
                 <List className="w-3.5 h-3.5" />
                 Registry
             </button>
        </div>
      </div>

      <div className="flex-1 glass-morphism rounded-[3rem] overflow-hidden relative border-white/5 shadow-2x shadow-brand-gold/5 min-h-[600px]">
          <AnimatePresence mode="wait">
            {view === 'orbit' ? (
              <motion.div 
                key="orbit"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full w-full"
              >
                  {/* Legend */}
                  <div className="absolute top-8 left-8 z-10 flex flex-col gap-4">
                      <div className="glass px-4 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border-white/10 group hover:border-brand-gold/30 transition-all">
                          <Target className="w-4 h-4 text-brand-gold" />
                          <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-none mb-1">Center</p>
                              <p className="text-xs font-bold text-white leading-none">Projects</p>
                          </div>
                      </div>
                      <div className="glass px-4 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border-white/10 group hover:border-brand-gold/30 transition-all">
                          <Shield className="w-4 h-4 text-blue-400" />
                          <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-none mb-1">Satellites</p>
                              <p className="text-xs font-bold text-white leading-none">High Priority</p>
                          </div>
                      </div>
                      <div className="glass px-4 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl border-white/10 group hover:border-brand-gold/30 transition-all">
                          <Layers className="w-4 h-4 text-white/20" />
                          <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 leading-none mb-1">Outskirts</p>
                              <p className="text-xs font-bold text-white leading-none">Completed</p>
                          </div>
                      </div>
                  </div>

                  {/* Quick Stats Overlay */}
                  <div className="absolute bottom-10 right-10 z-10 grid grid-cols-2 gap-4">
                      <div className="glass p-5 rounded-2xl backdrop-blur-2xl border-white/10 w-40">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">Mass</p>
                          <p className="text-2xl font-display font-medium text-brand-gold">{tasks.length}</p>
                          <p className="text-[9px] font-medium text-white/40 mt-1">Total Entitites</p>
                      </div>
                      <div className="glass p-5 rounded-2xl backdrop-blur-2xl border-white/10 w-40">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-2">Velocity</p>
                          <p className="text-2xl font-display font-medium text-brand-gold">92<span className="text-sm ml-1">%</span></p>
                          <p className="text-[9px] font-medium text-white/40 mt-1">Completion Rate</p>
                      </div>
                  </div>

                  <OrbitVisualization onMemberClick={(user) => setSelectedMember(user)} />
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full w-full p-10 overflow-y-auto no-scrollbar"
              >
                  <div className="max-w-5xl mx-auto">
                      <div className="flex items-center gap-3 mb-10">
                          <TrendingUp className="w-6 h-6 text-brand-gold" />
                          <h3 className="text-2xl font-display font-bold tracking-tight text-app-fg">Top Contributors</h3>
                      </div>

                      <div className="grid gap-4">
                          {rankedUsers.map((user, idx) => {
                              const stats = getMemberStats(user.id);
                              return (
                                  <motion.div 
                                      key={user.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.05 }}
                                      onClick={() => setSelectedMember(user)}
                                      className="group relative flex items-center justify-between p-6 bg-app-fg/[0.02] border border-app-border rounded-[2rem] hover:bg-app-fg/[0.05] hover:border-brand-gold/30 transition-all cursor-pointer"
                                  >
                                      <div className="flex items-center gap-6">
                                          <div className="relative">
                                              <div className="w-16 h-16 rounded-full border-2 border-brand-gold p-1 bg-brand-black">
                                                  <img src={user.avatar} className="w-full h-full rounded-full" alt="" />
                                              </div>
                                              {idx < 3 && (
                                                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-gold rounded-full flex items-center justify-center border-2 border-app-surface text-brand-black text-[10px] font-black">
                                                      #{idx + 1}
                                                  </div>
                                              )}
                                          </div>
                                          
                                          <div>
                                              <h4 className="text-xl font-display font-bold text-app-fg tracking-tight">{user.name}</h4>
                                              <p className="text-[10px] font-bold text-app-fg/20 uppercase tracking-widest">{user.role}</p>
                                          </div>
                                      </div>

                                      <div className="flex items-center gap-12">
                                          <div className="text-right">
                                              <p className="text-2xl font-display font-bold text-app-fg">{stats.score}</p>
                                              <p className="text-[9px] font-bold text-app-fg/20 uppercase tracking-widest">Impact Score</p>
                                          </div>
                                          <div className="h-10 w-[1px] bg-app-border" />
                                          <div className="flex gap-8">
                                              <div className="text-center">
                                                  <p className="text-lg font-bold text-app-fg">{stats.tasks.length}</p>
                                                  <p className="text-[9px] font-bold text-app-fg/20 uppercase tracking-widest">Signals</p>
                                              </div>
                                              <div className="text-center">
                                                  <p className="text-lg font-bold text-app-fg">{stats.projects.length}</p>
                                                  <p className="text-[9px] font-bold text-app-fg/20 uppercase tracking-widest">Nodes</p>
                                              </div>
                                          </div>
                                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-app-fg/10 group-hover:text-brand-gold transition-colors">
                                              <Star className={cn("w-5 h-5", idx === 0 && "fill-brand-gold text-brand-gold")} />
                                          </div>
                                      </div>
                                  </motion.div>
                              );
                          })}
                      </div>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Background Detail */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-gold rounded-full filter blur-[150px]" />
          </div>

          {/* Member Detail Sidebar/Modal Overlay */}
          <AnimatePresence>
              {selectedMember && selectedMemberStats && (
                  <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMember(null)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[200]"
                      />
                      <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-app-surface border-l border-white/5 z-[201] shadow-2xl p-8 overflow-y-auto no-scrollbar"
                      >
                           <button 
                             onClick={() => setSelectedMember(null)}
                             className="absolute top-8 right-8 p-2 text-white/20 hover:text-white transition-colors"
                           >
                               <X className="w-5 h-5" />
                           </button>

                           <div className="flex flex-col items-center text-center mt-8 mb-10">
                               <div className="w-24 h-24 rounded-full border-2 border-brand-gold p-1 bg-brand-black mb-6 shadow-[0_0_30px_rgba(245,230,200,0.15)]">
                                   <img src={selectedMember.avatar} alt={selectedMember.name} className="w-full h-full rounded-full" />
                               </div>
                               <h3 className="text-2xl font-display font-medium text-app-fg tracking-tight">{selectedMember.name}</h3>
                               <p className="text-[10px] text-app-fg/30 font-bold uppercase tracking-[0.3em] mt-1">{selectedMember.role}</p>
                               
                               <div className="flex gap-2 mt-6">
                                   <span className={cn(
                                       "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                       selectedMember.status === 'online' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-white/20 border-white/5"
                                   )}>
                                       {selectedMember.status}
                                   </span>
                                   <span className={cn(
                                       "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                       selectedMember.workload === 'critical' ? "bg-red-500/10 text-red-400 border-red-500/20" : 
                                       selectedMember.workload === 'high' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : 
                                       "bg-brand-gold/10 text-brand-gold border-brand-gold/20"
                                   )}>
                                       {selectedMember.workload} Workload
                                   </span>
                               </div>
                           </div>

                           <div className="space-y-10">
                               <section>
                                   <div className="flex items-center gap-2 mb-4">
                                       <Activity className="w-4 h-4 text-brand-gold" />
                                       <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-app-fg/20">Operational Stats</h4>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                       <div className="bg-app-fg/[0.02] border border-app-border rounded-2xl p-4">
                                           <p className="text-xl font-display font-bold text-app-fg">{selectedMemberStats.tasks.length}</p>
                                           <p className="text-[9px] font-bold text-app-fg/20 uppercase tracking-widest">Active Signals</p>
                                       </div>
                                       <div className="bg-app-fg/[0.02] border border-app-border rounded-2xl p-4">
                                           <p className="text-xl font-display font-bold text-app-fg">{selectedMemberStats.projects.length}</p>
                                           <p className="text-[9px] font-bold text-app-fg/20 uppercase tracking-widest">Project Nodes</p>
                                       </div>
                                   </div>
                               </section>

                               <section>
                                   <div className="flex items-center gap-2 mb-4">
                                       <Target className="w-4 h-4 text-brand-gold" />
                                       <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-app-fg/20">Current Signals</h4>
                                   </div>
                                   <div className="space-y-3">
                                       {selectedMemberStats.tasks.length === 0 ? (
                                           <p className="text-xs text-app-fg/20 italic">No signals currently assigned.</p>
                                       ) : (
                                           selectedMemberStats.tasks.map(task => (
                                               <div key={task.id} className="group p-4 bg-app-fg/[0.02] border border-app-border rounded-2xl hover:border-brand-gold/20 transition-all">
                                                   <div className="flex justify-between items-start mb-2">
                                                       <p className="text-sm font-bold text-app-fg tracking-tight leading-tight">{task.title}</p>
                                                       <span className={cn(
                                                           "px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border",
                                                           task.priority === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-app-fg/5 text-app-fg/40 border-white/5'
                                                       )}>
                                                           {task.priority}
                                                       </span>
                                                   </div>
                                                   <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1.5 text-app-fg/20">
                                                            <Clock className="w-3 h-3" />
                                                            <span className="text-[9px] font-bold uppercase tracking-widest">{task.dueDate}</span>
                                                        </div>
                                                   </div>
                                               </div>
                                           ))
                                       )}
                                   </div>
                               </section>

                               <section>
                                   <div className="flex items-center gap-2 mb-4">
                                       <Briefcase className="w-4 h-4 text-brand-gold" />
                                       <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-app-fg/20">Active Deployments</h4>
                                   </div>
                                   <div className="space-y-3">
                                       {selectedMemberStats.projects.length === 0 ? (
                                           <p className="text-xs text-app-fg/20 italic">No projects assigned.</p>
                                       ) : (
                                           selectedMemberStats.projects.map(project => (
                                               <div key={project.id} className="flex items-center gap-3 p-4 bg-app-fg/[0.02] border border-app-border rounded-2xl">
                                                   <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold font-bold text-xs">
                                                       {project.name.substring(0, 1)}
                                                   </div>
                                                   <div>
                                                       <p className="text-xs font-bold text-app-fg tracking-tight">{project.name}</p>
                                                       <div className="flex items-center gap-2 mt-1">
                                                           <div className="w-20 h-1 bg-app-border rounded-full overflow-hidden">
                                                               <div className="h-full bg-brand-gold" style={{ width: `${project.progress}%` }} />
                                                           </div>
                                                           <span className="text-[8px] font-bold text-app-fg/20">{project.progress}%</span>
                                                       </div>
                                                   </div>
                                               </div>
                                           ))
                                       )}
                                   </div>
                               </section>
                           </div>
                      </motion.div>
                  </>
              )}
          </AnimatePresence>
      </div>
    </div>
  );
}
