import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Target,
  ArrowRight,
  Focus,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function MemberDashboard() {
  const { currentUser, tasks, projects } = useStore();
  const navigate = useNavigate();
  const myTasks = tasks.filter(t => (t.assigneeIds || []).includes(currentUser?.id || '') && t.status !== 'done');
  const completedToday = 3; // Mock
  
  const stats = [
    { label: 'Pending Signals', value: myTasks.length, detail: 'Next due in 4h', icon: Target, path: '/member/tasks' },
    { label: 'Focus Score', value: '98', detail: 'Elite performance', icon: Zap, path: '/focus' },
    { label: 'Completed', value: completedToday, detail: 'Target met', icon: CheckCircle2, path: '/member/tasks' },
  ];

  return (
    <div className="space-y-8 pb-12 font-sans select-none animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shadow-[0_0_10px_rgba(245,230,200,0.5)]" />
            <span className="text-[10px] text-app-fg/40 font-bold uppercase tracking-widest">Agent Session Active</span>
          </div>
          <h2 className="text-5xl font-display font-bold tracking-tighter text-app-fg">Focus <span className="text-gradient-gold">Chamber</span></h2>
          <p className="text-app-fg/40 mt-1 font-light tracking-wide text-app-fg">Syncing your personal objective clusters, {currentUser?.name.split(' ')[0]}.</p>
        </motion.div>
        
        <Link 
          to="/focus"
          className="group px-8 py-4 bg-[#f5e6c8] text-brand-black font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_rgba(245,230,200,0.1)] active:scale-95"
        >
          <Focus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span>Enter Focus Protocol</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(s.path)}
            className="glass-morphism rounded-[2.5rem] p-8 group relative overflow-hidden h-44 flex flex-col justify-between cursor-pointer active:scale-98 transition-transform"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center border-white/5 transition-all group-hover:border-brand-gold/20">
                <s.icon className="w-5 h-5 text-brand-gold" />
              </div>
              <span className="text-[10px] font-bold text-white/10 group-hover:text-white/20 uppercase tracking-widest">Metric Status: Optimal</span>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-display font-bold text-white">{s.value}</p>
                <p className="text-xs font-bold text-brand-gold/60">{s.detail}</p>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 mt-2">{s.label}</p>
            </div>

            {/* Background Accent */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-gold/5 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Signals List */}
        <div className="lg:col-span-8 glass-morphism rounded-[3rem] p-10 bg-app-surface/20 border border-app-border">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-display font-bold text-app-fg">Personal Cluster</h3>
              <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-[0.3em] mt-1">High priority tasks assigned to your node</p>
            </div>
            <Link to="/member/tasks" className="text-[10px] font-bold uppercase tracking-widest text-brand-gold/60 hover:text-brand-gold flex items-center gap-2 group">
              View Sequence
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-6">
            {myTasks.length > 0 ? myTasks.slice(0, 4).map((task, idx) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                 className="group p-6 glass rounded-[2rem] flex items-center justify-between hover:bg-app-fg/[0.04] transition-all cursor-pointer border-app-border hover:border-brand-gold/10"
              >
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      task.priority === 'critical' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                      task.priority === 'high' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-brand-gold'
                    )} />
                    {task.priority === 'critical' && (
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold tracking-tight text-app-fg/90 group-hover:text-app-fg transition-colors">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {task.dueDate}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-app-border" />
                        <span className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest">{projects.find(p => p.id === task.projectId)?.name || 'General'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[9px] font-bold text-app-fg/20 uppercase tracking-[0.2em] mb-1">Status</span>
                        <span className="px-3 py-1 glass rounded-lg text-app-fg/60 text-[10px] font-bold uppercase tracking-widest border-app-border">
                            {task.status}
                        </span>
                    </div>
                    <div className="w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                        <ArrowRight className="w-4 h-4 text-brand-gold" />
                    </div>
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                 <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white/10" />
                 </div>
                 <p className="text-white/20 italic font-light max-w-[200px]">Node synchronization complete. No pending signals detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* AI Coach Card */}
          <div className="glass-morphism rounded-[2.5rem] p-10 bg-linear-to-br from-brand-gold/[0.08] via-transparent to-transparent border-brand-gold/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <Sparkles className="w-6 h-6 text-brand-gold/20 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
               <Zap className="w-5 h-5 text-brand-gold" />
               Strategic Insight
            </h3>
            <p className="text-sm text-white/70 font-light leading-relaxed mb-8 italic relative z-10">
              "System analysis indicates your output peak is imminent. Synchronizing 'Project Nexus' tasks now would yield 24% higher efficiency across the cluster."
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 glass rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-gold/10 transition-all text-brand-gold border-brand-gold/10"
            >
                Execute Optimization
            </motion.button>
          </div>
          
          {/* Output Heatmap */}
          <div className="glass-morphism rounded-[2.5rem] p-10">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold">Resonance Map</h3>
               <span className="text-[10px] font-bold text-white/20 uppercase">Last 28 Days</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 px-2">
                {[...Array(28)].map((_, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className={cn(
                            "aspect-square rounded-[3px] transition-all cursor-pointer hover:ring-2 ring-brand-gold/40",
                            i > 20 ? 'bg-brand-gold' : 
                            i > 10 ? 'bg-brand-gold/40' : 
                            i > 5 ? 'bg-brand-gold/10' : 'bg-white/5'
                        )} 
                    />
                ))}
            </div>
            <div className="flex justify-between items-center mt-6">
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Low Pulse</span>
                <div className="flex gap-1">
                   {[0.1, 0.3, 0.6, 1].map((o, i) => (
                       <div key={i} className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: '#f5e6c8', opacity: o }} />
                   ))}
                </div>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">High Resonance</span>
            </div>
            <p className="text-[10px] text-brand-gold/40 uppercase font-bold tracking-widest mt-6 text-center border-t border-white/5 pt-4">Consistent output streak: 12 cycles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
