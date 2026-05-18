import React from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp, Users, CheckCircle2, Zap, Target, Activity } from 'lucide-react';

const data = [
  { name: 'Jan', value: 400, completed: 240 },
  { name: 'Feb', value: 300, completed: 139 },
  { name: 'Mar', value: 200, completed: 980 },
  { name: 'Apr', value: 278, completed: 390 },
  { name: 'May', value: 189, completed: 480 },
  { name: 'Jun', value: 239, completed: 380 },
  { name: 'Jul', value: 349, completed: 430 },
];

const pieData = [
  { name: 'Design', value: 400 },
  { name: 'Dev', value: 300 },
  { name: 'Marketing', value: 300 },
  { name: 'Ops', value: 200 },
];

const COLORS = ['#f5e6c8', '#a08b6a', '#4a4a4a', '#222222'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tight">System Analytics</h2>
          <p className="text-white/40 mt-1 font-light">Deep dive into team efficiency and progress matrices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Velocity', value: '42.8', unit: 'tasks/wk', icon: Activity, color: 'text-brand-gold' },
          { label: 'Team Capacity', value: '88%', unit: 'current', icon: Users, color: 'text-blue-400' },
          { label: 'System Uptime', value: '99.9', unit: 'percent', icon: Zap, color: 'text-brand-gold' },
          { label: 'Target Alignment', value: '94', unit: 'score', icon: Target, color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-morphism p-6 rounded-3xl border-white/5 group hover:border-white/10 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
            <p className="text-3xl font-display font-medium">{stat.value}<span className="text-sm text-white/20 ml-1">{stat.unit}</span></p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism rounded-[2.5rem] p-8 border-white/5 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
               <TrendingUp className="w-5 h-5 text-brand-gold" />
               Performance Cycles
            </h3>
          </div>
          <div className="h-[350px] w-full min-h-[350px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f5e6c8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f5e6c8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} 
                  itemStyle={{ color: '#f5e6c8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#f5e6c8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-morphism rounded-[2.5rem] p-8 border-white/5 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
               <Users className="w-5 h-5 text-brand-gold" />
               Workload Distribution
            </h3>
          </div>
          <div className="h-[350px] w-full flex items-center justify-center min-h-[350px] min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-morphism rounded-[2.5rem] p-8 border-white/5 min-w-0">
           <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold">Weekly Throughput</h3>
           </div>
           <div className="h-[300px] w-full min-h-[300px] min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={50}>
                    <BarChart data={data}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                        <Bar dataKey="completed" fill="#f5e6c8" radius={[12, 12, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
           </div>
      </div>
    </div>
  );
}
