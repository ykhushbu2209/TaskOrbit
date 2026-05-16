import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Maximize2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import OrbitVisualization from '../components/OrbitVisualization';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

export default function AdminDashboard() {
  const { tasks, projects } = useStore();
  
  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: CheckCircle2 },
    { label: 'Todo', value: tasks.filter(t => t.status === 'todo').length, icon: Clock },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, icon: TrendingUp },
    { label: 'In Review', value: tasks.filter(t => t.status === 'in-review').length, icon: AlertCircle },
    { label: 'Done', value: tasks.filter(t => t.status === 'done').length, icon: CheckCircle2 },
  ];

  const chartData = [
    { name: 'Mon', completed: 12 },
    { name: 'Tue', completed: 18 },
    { name: 'Wed', completed: 15 },
    { name: 'Thu', completed: 22 },
    { name: 'Fri', completed: 19 },
    { name: 'Sat', completed: 8 },
    { name: 'Sun', completed: 5 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-white/40 mt-1 font-light">Monitor your team's progress and performance.</p>
        </div>
        <button className="px-6 py-3 bg-brand-gold text-brand-black font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(251,191,36,0.2)]">
          <Zap className="w-4 h-4" />
          <span>Initialize Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="col-span-full glass-morphism rounded-3xl p-8 flex items-center justify-between group overflow-hidden relative">
            <div className="flex items-center gap-6 relative z-10">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Tasks</h3>
                    <p className="text-sm text-white/40 mt-0.5">Real-time task synchronization across clusters</p>
                </div>
            </div>
            <div className="flex-1 flex justify-around px-8">
                {stats.map((s, i) => (
                    <div key={i} className="text-center group-hover:transform group-hover:scale-110 transition-all duration-500">
                        <p className="text-3xl font-display font-bold text-brand-ivory">{s.value}</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
            <button className="p-3 text-white/20 hover:text-white transition-colors relative z-10">
                <Maximize2 className="w-5 h-5" />
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[80px] -z-0 rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-morphism rounded-3xl overflow-hidden relative min-h-[500px]">
          <OrbitVisualization />
        </div>

        <div className="space-y-8">
          <div className="glass-morphism rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Critical Deadlines
              </h3>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 2).map((p) => (
                <div key={p.id} className="p-4 glass rounded-2xl group hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm">{p.name}</h4>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 uppercase font-bold tracking-tighter">Due</span>
                  </div>
                  <p className="text-xs text-white/40 mb-3">{p.deadline}</p>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-brand-purple"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-morphism rounded-3xl p-6 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-brand-purple/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-purple" />
              </div>
              <h3 className="text-lg font-bold">AI Insights</h3>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="p-4 glass rounded-2xl border-l-2 border-brand-teal">
                <p className="text-xs text-brand-teal font-bold uppercase tracking-widest mb-1">Sprint Velocity</p>
                <p className="text-sm text-white/70 font-light">Team velocity is up by 15% this week. Suggesting 2 extra points for next sprint.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-morphism rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Productivity Metrics</h3>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Bar dataKey="completed" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
      </div>
    </div>
  );
}
