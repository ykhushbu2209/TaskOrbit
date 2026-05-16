import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  Target,
  ArrowRight,
  Focus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';

export default function MemberDashboard() {
  const { currentUser, tasks } = useStore();
  const myTasks = tasks.filter(t => t.assigneeId === currentUser?.id);
  
  const stats = [
    { label: 'My Tasks', value: myTasks.length, icon: Target },
    { label: 'Completed', value: myTasks.filter(t => t.status === 'done').length, icon: CheckCircle2 },
    { label: 'Pending', value: myTasks.filter(t => t.status !== 'done').length, icon: Clock },
    { label: 'Focus Score', value: '92%', icon: Zap },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tight">Focus Chamber</h2>
          <p className="text-white/40 mt-1 font-light">Welcome back, {currentUser?.name}. It's time to create.</p>
        </div>
        <Link 
          to="/member/focus"
          className="px-6 py-3 bg-brand-purple text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(139,92,246,0.3)]"
        >
          <Focus className="w-4 h-4" />
          <span>Enter Focus Mode</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-morphism rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center">
                <s.icon className="w-5 h-5 text-brand-purple" />
              </div>
              <TrendingUp className="w-4 h-4 text-brand-teal opacity-50" />
            </div>
            <p className="text-3xl font-display font-bold">{s.value}</p>
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mt-1">{s.label}</p>
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-purple/5 blur-2xl group-hover:scale-150 transition-transform" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-morphism rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">My Active Tasks</h3>
            <button className="text-xs text-brand-purple hover:underline font-bold uppercase tracking-widest">View All</button>
          </div>
          
          <div className="space-y-4">
            {myTasks.length > 0 ? myTasks.map((task) => (
              <div key={task.id} className="group p-4 glass rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    task.priority === 'critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                    task.priority === 'high' ? 'bg-orange-500' : 'bg-brand-teal'
                  )} />
                  <div>
                    <h4 className="font-bold text-sm group-hover:text-brand-purple transition-colors">{task.title}</h4>
                    <p className="text-xs text-white/30 font-light mt-0.5">Due {task.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] px-2 py-1 glass rounded-md text-white/40 uppercase font-bold tracking-tighter">
                        {task.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
                </div>
              </div>
            )) : (
              <p className="text-center py-12 text-white/20 italic font-light">All systems clear. No pending tasks.</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-morphism rounded-3xl p-8 bg-linear-to-br from-brand-purple/20 to-transparent border-brand-purple/20">
            <h3 className="text-lg font-bold mb-4">AI Coach</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6 italic">
              "Based on your recent work pattern, you are most productive between 10 AM and 12 PM. Suggesting a Focus Session for 'Neural Nexus' shortly."
            </p>
            <button className="w-full py-3 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                Accept suggestion
            </button>
          </div>
          
          <div className="glass-morphism rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6">Daily Heatmap</h3>
            <div className="grid grid-cols-7 gap-2">
                {[...Array(28)].map((_, i) => (
                    <div 
                        key={i} 
                        className={cn(
                            "aspect-square rounded-sm",
                            Math.random() > 0.5 ? 'bg-brand-purple/40' : 
                            Math.random() > 0.3 ? 'bg-brand-purple/20' : 'bg-white/5'
                        )} 
                    />
                ))}
            </div>
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest mt-4 text-center">Consistent output streak: 12 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
