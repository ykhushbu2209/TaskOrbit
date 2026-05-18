import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Maximize2,
  TrendingUp,
  Activity,
  X,
  Plus,
  UserPlus,
  Folder,
  Calendar,
  ChevronRight,
  Filter,
  FileText,
  Sparkles,
  Loader2,
  LayoutGrid,
  List,
  Star,
  Briefcase,
  Target
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStore, Task, User } from '../store/useStore';
import { cn } from '../lib/utils';
import OrbitVisualization from '../components/OrbitVisualization';
import { DashboardSkeleton } from '../components/Skeleton';

export default function AdminDashboard() {
  const { tasks, projects, users, addTask, addUser, currentUser } = useStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isTasksExpanded, setIsTasksExpanded] = useState(false);
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEODModalOpen, setIsEODModalOpen] = useState(false);
  const [eodReport, setEodReport] = useState('');
  const [isGeneratingEOD, setIsGeneratingEOD] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'todo' | 'in-progress' | 'in-review' | 'done'>('all');
  const [view, setView] = useState<'orbit' | 'list'>('orbit');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const getMemberStats = (userId: string) => {
    const memberTasks = tasks.filter(t => (t.assigneeIds || []).includes(userId));
    const memberProjects = projects.filter(p => 
      (p.teamIds || []).includes(userId) || 
      memberTasks.some(t => t.projectId === p.id)
    );
    const completedTasks = memberTasks.filter(t => t.status === 'done').length;
    const activeTasks = memberTasks.filter(t => t.status !== 'done').length;
    
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

  // Form State - Task
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: projects[0]?.id || '',
    priority: 'medium' as Task['priority'],
    dueDate: new Date().toISOString().split('T')[0],
    assigneeIds: [] as string[]
  });

  // Form State - Member
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) return <DashboardSkeleton />;
  
  const stats = [
    { id: 'all', label: 'TOTAL TASKS', value: tasks.length, color: 'text-blue-500' },
    { id: 'todo', label: 'TO DO', value: tasks.filter(t => t.status === 'todo').length, color: 'text-app-fg/60' },
    { id: 'in-progress', label: 'IN PROGRESS', value: tasks.filter(t => t.status === 'in-progress').length, color: 'text-brand-gold' },
    { id: 'in-review', label: 'IN REVIEW', value: tasks.filter(t => t.status === 'in-review').length, color: 'text-brand-purple' },
    { id: 'done', label: 'DONE', value: tasks.filter(t => t.status === 'done').length, color: 'text-brand-teal' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...newTask,
      status: 'todo',
      assigneeIds: [], // Unassigned by default
      createdAt: new Date().toISOString().split('T')[0],
      tags: []
    };
    addTask(task);
    setIsInitModalOpen(false);
    setNewTask({
      title: '',
      description: '',
      projectId: projects[0]?.id || '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      assigneeIds: []
    });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const member = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name,
      email: newMember.email,
      password: newMember.password,
      role: 'member' as const,
      adminId: currentUser.id,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMember.name}`,
      status: 'offline' as const,
      workload: 'optimal' as const,
    };
    addUser(member);
    setIsAddMemberModalOpen(false);
    setNewMember({ name: '', email: '', password: '' });
  };

  const generateEODReport = async () => {
     setIsGeneratingEOD(true);
     setIsEODModalOpen(true);
     try {
        const response = await fetch('/api/generate-eod', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tasks,
                projects,
                users,
                date: new Date().toLocaleDateString()
            })
        });
        const data = await response.json();
        if (data.report) {
            setEodReport(data.report);
        } else {
            setEodReport('Failed to generate intelligence summary. Please retry.');
        }
     } catch (err) {
        console.error(err);
        setEodReport('A connection anomaly occurred during AI relay.');
     } finally {
        setIsGeneratingEOD(false);
     }
  };

  const filteredTasks = selectedStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === selectedStatus);

  const recentActivities = [
    { type: 'created', task: 'Backend', time: '08:13 PM', user: 'You', avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
    { type: 'created', task: 'Frontend', time: '06:22 PM', user: 'You', avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
    { type: 'created', task: 'SOP', time: '06:21 PM', user: 'You', avatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
  ];

  const teamActivities = [
    { type: 'completed', task: 'API Integration', time: '09:45 AM', user: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { type: 'reviewed', task: 'Landing Page', time: '11:20 AM', user: 'Marcus Wright', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
    { type: 'updated', task: 'Schema v2', time: '02:15 PM', user: 'Elena Rodriguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans select-none animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tight text-app-fg mb-1">Dashboard Overview</h2>
          <p className="text-app-fg/40 font-light tracking-wide text-sm">Monitor your team's progress and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={generateEODReport}
            className="px-6 py-3 bg-brand-purple/10 border border-brand-purple/30 text-brand-purple font-bold rounded-xl flex items-center gap-2 hover:bg-brand-purple/20 transition-all font-sans"
          >
              <Sparkles className="w-5 h-5" />
              <span>AI EOD</span>
          </button>
          <button 
            onClick={() => setIsAddMemberModalOpen(true)}
            className="px-6 py-3 bg-app-fg/5 border border-app-border text-app-fg font-bold rounded-xl flex items-center gap-2 hover:bg-app-fg/10 transition-all font-sans"
          >
              <UserPlus className="w-5 h-5 text-brand-gold" />
              <span>Add Member</span>
          </button>
          <button 
            onClick={() => setIsInitModalOpen(true)}
            className="px-6 py-3 bg-[#f5e6c8] text-brand-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-gold/5"
          >
              <Plus className="w-5 h-5" />
              <span>Initialize Task</span>
          </button>
        </div>
      </div>

      {/* Tasks Overview Row (Matched to Screenshot) */}
      <div className="glass-morphism rounded-3xl p-8 border-app-border relative overflow-hidden group">
         <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-app-fg/40" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-app-fg">Tasks</h3>
                    <p className="text-[11px] text-app-fg/30 font-medium tracking-wide mt-0.5">Click to expand and view detailed task data</p>
                </div>
            </div>

            <button 
              onClick={() => setIsTasksExpanded(true)}
              className="p-3 text-app-fg/10 hover:text-app-fg/40 transition-colors bg-white/5 rounded-2xl border border-white/5"
            >
                <Maximize2 className="w-5 h-5" />
            </button>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
            {stats.map((s, i) => (
                <div 
                    key={i} 
                    onClick={() => navigate('/admin/tasks')}
                    className="bg-app-card border border-white/5 rounded-[1.5rem] p-7 text-center group/card hover:bg-white/[0.05] transition-all cursor-pointer"
                >
                    <p className={cn("text-4xl font-display font-bold mb-3", s.color)}>{s.value}</p>
                    <p className="text-[9px] uppercase tracking-[0.25em] font-extrabold text-app-fg/10">{s.label}</p>
                </div>
            ))}
         </div>

         <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Main Grid: Orbit & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        <div className="lg:col-span-8 glass-morphism rounded-[2.5rem] bg-brand-deep/50 border-app-border shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-8 right-8 z-20 flex gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5">
                <button 
                    onClick={() => setView('orbit')}
                    className={cn(
                        "p-2 rounded-xl transition-all",
                        view === 'orbit' ? "bg-brand-gold text-brand-black" : "text-white/40 hover:text-white"
                    )}
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => setView('list')}
                    className={cn(
                        "p-2 rounded-xl transition-all",
                        view === 'list' ? "bg-brand-gold text-brand-black" : "text-white/40 hover:text-white"
                    )}
                >
                    <List className="w-5 h-5" />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {view === 'orbit' ? (
                    <motion.div 
                        key="orbit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col"
                    >
                        <div className="p-8 pb-0">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Activity className="w-5 h-5 text-brand-gold" />
                                Team Resonance
                            </h3>
                            <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest mt-1">Gravitational workload distribution</p>
                        </div>
                        <div className="flex-1">
                            <OrbitVisualization onMemberClick={(user) => setSelectedMember(user)} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="h-full flex flex-col p-8 bg-app-surface/30"
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <List className="w-5 h-5 text-brand-gold" />
                                Team Registry
                            </h3>
                            <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest mt-1">Ranked by Operational Impact</p>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                            {rankedUsers.map((user, idx) => {
                                const stats = getMemberStats(user.id);
                                return (
                                    <div 
                                        key={user.id}
                                        onClick={() => setSelectedMember(user)}
                                        className="flex items-center justify-between p-4 bg-app-fg/[0.03] border border-app-border rounded-2xl hover:bg-app-fg/[0.06] transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-full border border-brand-gold/30 p-0.5">
                                                    <img src={user.avatar} className="w-full h-full rounded-full" alt="" />
                                                </div>
                                                {idx < 3 && (
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold rounded-full flex items-center justify-center text-[8px] font-black text-brand-black border border-app-surface">
                                                        {idx + 1}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-app-fg group-hover:text-brand-gold transition-colors">{user.name}</p>
                                                <p className="text-[9px] text-app-fg/20 font-bold uppercase tracking-widest">{user.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-app-fg">{stats.score}</p>
                                                <p className="text-[8px] font-bold text-app-fg/20 uppercase tracking-widest">Impact</p>
                                            </div>
                                            <Star className={cn("w-4 h-4", idx === 0 ? "text-brand-gold fill-brand-gold" : "text-app-fg/10")} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="lg:col-span-4 glass-morphism rounded-[2.5rem] p-10 border-app-border flex flex-col h-full bg-app-surface/50 overflow-hidden">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold flex items-center gap-3">
                   <TrendingUp className="w-5 h-5 text-brand-teal" />
                   Critical Deadlines
                </h3>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                {tasks.filter(t => t.priority === 'high' || t.priority === 'critical').slice(0, 4).map((task) => (
                    <div key={task.id} className="p-6 bg-app-fg/[0.02] border border-app-border rounded-2xl hover:border-brand-gold/20 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                           <h4 className="font-bold text-app-fg/90 group-hover:text-app-fg truncate pr-4">{task.title}</h4>
                           <span className={cn(
                               "text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-widest",
                               task.priority === 'critical' ? "border-red-500/20 text-red-500 bg-red-500/5" : "border-brand-gold/20 text-brand-gold bg-brand-gold/5"
                           )}>
                               {task.priority === 'critical' ? 'Urgent' : 'Due'}
                           </span>
                        </div>
                        <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest mb-4">{task.dueDate}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-brand-gold/60 uppercase tracking-tighter">{task.status}</span>
                            <div className="w-6 h-6 rounded-full bg-app-fg/10 border border-app-border" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism rounded-[3rem] p-10 bg-brand-graphite/10 border-app-border">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 rounded-2xl bg-brand-gold/5 border border-brand-gold/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-brand-gold" />
               </div>
               <h3 className="text-2xl font-display font-bold">My Recent Activities</h3>
            </div>

            <div className="space-y-10 px-4 relative">
                <div className="absolute left-[3.25rem] top-4 bottom-4 w-px bg-app-border" />
                {recentActivities.map((activity, i) => (
                    <div key={i} className="flex items-center gap-8 relative z-10 group">
                        <div className="w-12 h-12 rounded-full border-2 border-app-border p-0.5 bg-app-surface shadow-2xl transition-transform group-hover:scale-110">
                             <img src={activity.avatar} alt="" className="w-full h-full rounded-full" />
                        </div>
                        <div className="flex-1">
                            <p className="text-base text-app-fg/40 font-medium">
                                <span className="text-app-fg font-bold mr-1">{activity.user}</span> 
                                created task 
                                <span className="text-app-fg font-black ml-1">{activity.task}</span>
                            </p>
                            <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest mt-1.5">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="glass-morphism rounded-[3rem] p-10 bg-brand-graphite/10 border-app-border">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-10 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-brand-purple" />
               </div>
               <h3 className="text-2xl font-display font-bold">Team Performance</h3>
            </div>

            <div className="space-y-10 px-4 relative">
                <div className="absolute left-[3.25rem] top-4 bottom-4 w-px bg-app-border" />
                {teamActivities.map((activity, i) => (
                    <div key={i} className="flex items-center gap-8 relative z-10 group">
                        <div className="w-12 h-12 rounded-full border-2 border-app-border p-0.5 bg-app-surface shadow-2xl transition-transform group-hover:scale-110">
                             <img src={activity.avatar} alt="" className="w-full h-full rounded-full" />
                        </div>
                        <div className="flex-1">
                            <p className="text-base text-app-fg/40 font-medium">
                                <span className="text-app-fg font-bold mr-1">{activity.user}</span> 
                                {activity.type} 
                                <span className="text-app-fg font-black ml-1">{activity.task}</span>
                            </p>
                            <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest mt-1.5">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {/* Task Initializer Modal (Matched to Screenshot) */}
        {isInitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInitModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-app-surface rounded-[1.5rem] border border-app-border shadow-2xl overflow-hidden"
            >
              <div className="p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-bold text-app-fg">Initialize Task</h3>
                    <p className="text-app-fg/40 text-sm mt-1">Assign a new task to your team projects.</p>
                  </div>
                  <button onClick={() => setIsInitModalOpen(false)} className="text-app-fg/30 hover:text-app-fg transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateTask} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">TASK NAME *</label>
                    <input 
                      required
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      type="text" 
                      placeholder="e.g. Design Landing Page"
                      className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl px-6 py-5 text-app-fg focus:outline-hidden focus:border-brand-gold/30 transition-all placeholder:text-app-fg/20 font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">TASK DESCRIPTION</label>
                    <textarea 
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Describe the task details..."
                      className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl px-6 py-5 text-app-fg focus:outline-hidden focus:border-brand-gold/30 transition-all min-h-32 placeholder:text-app-fg/20 font-medium resize-none text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">PROJECT *</label>
                      <select 
                        value={newTask.projectId}
                        onChange={e => setNewTask({...newTask, projectId: e.target.value})}
                        className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl px-6 py-5 text-app-fg focus:outline-hidden focus:border-brand-gold/30 transition-all appearance-none cursor-pointer text-sm font-medium"
                      >
                        <option value="" disabled className="bg-app-surface">Choose a project</option>
                        {projects.map(p => <option key={p.id} value={p.id} className="bg-app-surface">{p.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">DEADLINE</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={newTask.dueDate}
                          onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                          className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl px-14 py-5 text-app-fg focus:outline-hidden focus:border-brand-gold/30 transition-all text-sm font-medium [color-scheme:dark]"
                        />
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-app-fg/20" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">PRIORITY</label>
                      <select 
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                        className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl px-6 py-5 text-app-fg focus:outline-hidden focus:border-brand-gold/30 transition-all appearance-none cursor-pointer text-sm font-medium"
                      >
                        <option value="low" className="bg-app-surface">Low</option>
                        <option value="medium" className="bg-app-surface">Medium</option>
                        <option value="high" className="bg-app-surface">High</option>
                        <option value="critical" className="bg-app-surface">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 relative">
                    <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">ASSIGN TO (TEAM MEMBERS)</label>
                    <div 
                        onClick={() => setIsMemberSelectorOpen(!isMemberSelectorOpen)}
                        className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl px-6 py-5 flex flex-wrap gap-2 cursor-pointer hover:border-brand-gold/30 transition-all min-h-[64px] items-center"
                    >
                        {((newTask.assigneeIds || [])).length === 0 ? (
                            <span className="text-app-fg/20 text-sm font-medium">Select team members...</span>
                        ) : (
                            ((newTask.assigneeIds || [])).map(id => {
                                const user = users.find(u => u.id === id);
                                return (
                                    <div key={id} className="bg-brand-gold text-brand-black px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                                        {user?.name}
                                        <X 
                                            className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNewTask({...newTask, assigneeIds: (newTask.assigneeIds || []).filter(idx => idx !== id)});
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
                                                            ? (newTask.assigneeIds || []).filter(id => id !== user.id)
                                                            : [...(newTask.assigneeIds || []), user.id];
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
                                                        <span className="font-bold text-sm tracking-tight">{user.name}</span>
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
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-app-border bg-app-fg/[0.01] flex justify-end items-center gap-4">
                  <button 
                    onClick={() => setIsInitModalOpen(false)}
                    className="px-10 py-4 rounded-xl border border-app-border text-app-fg font-bold text-sm hover:bg-app-fg/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreateTask}
                    className="px-10 py-4 bg-[#f5e6c8] text-brand-black font-bold rounded-xl text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-gold/5"
                  >
                    <Plus className="w-4 h-4" />
                    Initialize Task
                  </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Expanded Tasks Overlay (Matching Screenshot) */}
        {isTasksExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-app-bg/95 backdrop-blur-2xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-6xl h-full max-h-[85vh] bg-app-surface rounded-[3rem] border border-app-border flex flex-col overflow-hidden shadow-2xl"
              >
                  {/* Overlay Header */}
                  <div className="p-10 border-b border-app-border flex justify-between items-center bg-app-fg/[0.02]">
                      <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-app-fg/[0.03] border border-app-border rounded-2xl flex items-center justify-center">
                              <CheckCircle2 className="w-8 h-8 text-app-fg/40" />
                          </div>
                          <div>
                              <h3 className="text-3xl font-display font-bold text-app-fg">Tasks Overview</h3>
                              <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-[0.4em] mt-1">Detailed breakdown by status</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => setIsTasksExpanded(false)}
                        className="w-12 h-12 bg-app-fg/5 border border-app-border rounded-2xl flex items-center justify-center text-app-fg/20 hover:text-app-fg hover:bg-app-fg/10 transition-all shadow-lg"
                      >
                          <X className="w-6 h-6" />
                      </button>
                  </div>

                  {/* Overlay Main Content */}
                  <div className="flex-1 flex overflow-hidden">
                      {/* Left Sidebar Statuses */}
                      <div className="w-72 border-r border-app-border p-8 flex flex-col gap-3">
                          {stats.map((status) => (
                              <button 
                                key={status.id}
                                onClick={() => setSelectedStatus(status.id as any)}
                                className={cn(
                                    "flex items-center justify-between p-5 rounded-2xl transition-all group text-left",
                                    selectedStatus === status.id 
                                        ? "bg-[#f5e6c8] text-brand-black font-bold shadow-[0_10px_30px_rgba(245,230,200,0.15)]" 
                                        : "text-app-fg/40 hover:bg-app-fg/[0.03] hover:text-app-fg"
                                )}
                              >
                                  <span className="text-[15px] tracking-tight">{status.label}</span>
                                  <span className={cn(
                                      "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                      selectedStatus === status.id ? "bg-brand-black/10 border-brand-black/20" : "bg-app-fg/5 border-app-border text-app-fg/20"
                                  )}>{status.value}</span>
                              </button>
                          ))}
                      </div>

                      {/* Main Task List Area */}
                      <div className="flex-1 p-10 overflow-y-auto no-scrollbar bg-app-fg/[0.01]">
                          <div className="flex items-center justify-between mb-10">
                              <h4 className="text-2xl font-display font-bold text-app-fg">
                                {stats.find(s => s.id === selectedStatus)?.label} <span className="text-app-fg/20">Tasks</span>
                              </h4>
                              <div className="flex items-center gap-3">
                                  <button className="p-2.5 bg-app-fg/5 border border-app-border rounded-xl text-app-fg/20 hover:text-app-fg transition-colors">
                                      <Filter className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>

                          <div className="space-y-4">
                              {filteredTasks.length > 0 ? filteredTasks.map((task, idx) => (
                                  <motion.div 
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="p-6 bg-app-surface border border-app-border rounded-2xl hover:border-brand-gold/20 transition-all group relative overflow-hidden"
                                  >
                                      <div className="flex items-center justify-between relative z-10">
                                          <div className="flex items-center gap-6">
                                              <div>
                                                  <h5 className="text-xl font-bold text-app-fg mb-2">{task.title}</h5>
                                                  <div className="flex items-center gap-4">
                                                      <span className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest flex items-center gap-2">
                                                          <Folder className="w-3 h-3" />
                                                          {projects.find(p => p.id === task.projectId)?.name}
                                                      </span>
                                                      <span className="w-1 h-1 rounded-full bg-app-fg/10" />
                                                      <span className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest flex items-center gap-2">
                                                          <Calendar className="w-3 h-3" />
                                                          {task.dueDate}
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>

                                           <div className="flex items-center gap-8">
                                              <div className="flex items-center gap-3">
                                                  <div className="flex -space-x-2">
                                                    {(task.assigneeIds || []).slice(0, 3).map(id => (
                                                      <img 
                                                        key={id}
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`} 
                                                        alt="" 
                                                        className="w-7 h-7 rounded-full border-2 border-app-surface"
                                                      />
                                                    ))}
                                                    {(task.assigneeIds || []).length === 0 && <span className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest">Unassigned</span>}
                                                  </div>
                                                  <span className="text-[13px] font-bold text-app-fg/60">{(task.assigneeIds || []).length > 0 ? 'Assigned' : ''}</span>
                                              </div>
                                              <div className={cn(
                                                  "px-4 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                                                  task.priority === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                                                  task.priority === 'high' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                                                  'bg-app-fg/5 border-app-border text-app-fg/40'
                                              )}>
                                                  {task.priority}
                                              </div>
                                              <ChevronRight className="w-5 h-5 text-app-fg/10 group-hover:text-brand-gold group-hover:translate-x-1 transition-all" />
                                          </div>
                                      </div>
                                      <div className="absolute inset-0 bg-brand-gold/[0.01] opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
                                  </motion.div>
                              )) : (
                                  <div className="h-64 flex flex-col items-center justify-center text-center">
                                      <div className="w-16 h-16 bg-app-fg/5 border border-app-border rounded-full flex items-center justify-center mb-4 text-app-fg/10">
                                          <CheckCircle2 className="w-8 h-8" />
                                      </div>
                                      <p className="text-app-fg/20 italic font-light">No tasks found in this resonance cluster.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </motion.div>
          </div>
        )}
        {/* Add Member Modal */}
        {isAddMemberModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddMemberModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-app-surface border border-app-border rounded-[1.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] -z-0 rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="text-3xl font-bold">Add Member</h3>
                  <p className="text-app-fg/40 text-sm mt-1">Assign access credentials for your team member.</p>
                </div>
                <button onClick={() => setIsAddMemberModalOpen(false)} className="text-app-fg/30 hover:text-app-fg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">MEMBER NAME *</label>
                  <input 
                    required
                    value={newMember.name}
                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                    type="text" 
                    placeholder="Full Name"
                    className="w-full bg-app-fg/[0.03] border border-app-border rounded-xl px-4 py-3 focus:outline-hidden focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">MEMBER ID / EMAIL *</label>
                  <input 
                    required
                    value={newMember.email}
                    onChange={e => setNewMember({...newMember, email: e.target.value})}
                    type="email" 
                    placeholder="member@taskorbit.com"
                    className="w-full bg-app-fg/[0.03] border border-app-border rounded-xl px-4 py-3 focus:outline-hidden focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-app-fg/30 uppercase tracking-[0.2em]">SET PASSWORD *</label>
                  <input 
                    required
                    value={newMember.password}
                    onChange={e => setNewMember({...newMember, password: e.target.value})}
                    type="password" 
                    placeholder="••••••"
                    className="w-full bg-app-fg/[0.03] border border-app-border rounded-xl px-4 py-3 focus:outline-hidden focus:border-brand-gold/50 transition-all font-medium"
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#f5e6c8] text-brand-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-gold/5"
                  >
                    Authorize & Create account
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAddMemberModalOpen(false)}
                    className="w-full py-4 text-app-fg/30 font-bold text-xs uppercase tracking-widest hover:text-app-fg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {/* AI EOD Modal */}
        {isEODModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGeneratingEOD && setIsEODModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl bg-app-surface rounded-[2rem] border border-app-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-10 border-b border-app-border flex justify-between items-center bg-brand-purple/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-brand-purple" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-display font-bold">End of Day Intelligence</h3>
                        <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-widest mt-1">Generated by TaskOrbit Core AI</p>
                    </div>
                </div>
                <button onClick={() => setIsEODModalOpen(false)} className="text-app-fg/20 hover:text-app-fg transition-colors">
                    <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 prose prose-invert prose-brand max-w-none no-scrollbar">
                  {isGeneratingEOD ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center">
                          <Loader2 className="w-12 h-12 text-brand-purple animate-spin mb-6" />
                          <p className="text-xl font-display font-medium text-app-fg mb-2">Analyzing Team Dynamics</p>
                          <p className="text-app-fg/40 text-sm">Synthesizing daily operational data into high-level intelligence...</p>
                      </div>
                  ) : (
                      <div className="markdown-body">
                         <ReactMarkdown>{eodReport}</ReactMarkdown>
                      </div>
                  )}
              </div>

              <div className="p-8 border-t border-app-border bg-app-fg/[0.01] flex justify-end gap-3">
                  <button 
                    onClick={() => setIsEODModalOpen(false)}
                    className="px-8 py-3 rounded-xl border border-app-border text-app-fg font-bold text-sm hover:bg-app-fg/5 transition-all"
                  >
                    Close Briefing
                  </button>
                  <button 
                     onClick={() => {
                        const blob = new Blob([eodReport], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `EOD_Report_${new Date().toISOString().split('T')[0]}.md`;
                        a.click();
                     }}
                     disabled={isGeneratingEOD}
                     className="px-8 py-3 bg-brand-purple text-white font-bold rounded-xl text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-purple/20 disabled:opacity-50"
                  >
                    <FileText className="w-4 h-4" />
                    Export Report
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Detail Modal - Precise match to screenshot */}
      <AnimatePresence>
        {selectedMember && selectedMemberStats && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-4xl bg-[#141414] rounded-[2.5rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            >
              <div className="p-12 pb-8 flex justify-between items-start bg-gradient-to-b from-white/[0.04] to-transparent">
                  <div className="flex items-center gap-8">
                      <div className="w-28 h-28 rounded-3xl bg-brand-black border border-white/10 p-1 flex items-center justify-center shadow-2xl">
                          <img src={selectedMember.avatar} className="w-full h-full rounded-2xl" alt="" />
                      </div>
                      <div>
                          <h3 className="text-5xl font-display font-medium text-white tracking-tight leading-none mb-3">{selectedMember.name}</h3>
                          <p className="text-base text-white/30 font-medium uppercase tracking-[0.1em]">
                              {selectedMember.email} • {selectedMember.role.toUpperCase()}
                          </p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="w-14 h-14 bg-brand-black/50 hover:bg-brand-black hover:text-white text-white/20 rounded-full flex items-center justify-center border border-white/5 transition-all shadow-xl"
                  >
                      <X className="w-7 h-7" />
                  </button>
              </div>

              <div className="p-12 pt-4 grid grid-cols-12 gap-12 min-h-[500px]">
                  <div className="col-span-4 space-y-5">
                      <div className="bg-white/[0.02] border border-white/5 rounded-[2.25rem] p-9 py-10 transition-all hover:bg-white/[0.04] group">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-4 group-hover:text-white/40 transition-colors">TASKS ASSIGNED</p>
                          <p className="text-6xl font-display font-bold text-white leading-none">{selectedMemberStats.tasks.length}</p>
                      </div>
                      
                      <div className="bg-white/[0.02] border border-white/5 rounded-[2.25rem] p-9 py-10 transition-all hover:bg-white/[0.04] group">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-4 group-hover:text-white/40 transition-colors">COMPLETED TASKS</p>
                          <p className="text-6xl font-display font-bold text-white/5 group-hover:text-white/10 transition-colors leading-none">{selectedMemberStats.completedCount}</p>
                      </div>

                      <div className={cn(
                          "rounded-[2.25rem] p-9 py-10 border transition-all relative overflow-hidden group",
                          selectedMember.workload === 'critical' ? "bg-red-500/10 border-red-500/20" :
                          selectedMember.workload === 'high' ? "bg-orange-500/10 border-orange-500/20" :
                          "bg-[#0d1a14] border-emerald-500/10"
                      )}>
                          <div className="flex items-center gap-3 mb-6 relative z-10">
                              <Activity className={cn("w-5 h-5", selectedMember.workload === 'low' || selectedMember.workload === 'optimal' ? "text-emerald-400" : "text-brand-gold")} />
                              <p className={cn(
                                  "text-[10px] font-black uppercase tracking-[0.2em]",
                                  selectedMember.workload === 'low' || selectedMember.workload === 'optimal' ? "text-emerald-400" : "text-brand-gold"
                              )}>CURRENT WORKLOAD</p>
                          </div>
                          <p className={cn(
                              "text-5xl font-display font-bold uppercase relative z-10 leading-none",
                              selectedMember.workload === 'low' || selectedMember.workload === 'optimal' ? "text-emerald-400" : "text-brand-gold"
                          )}>{selectedMember.workload}</p>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                  </div>

                  <div className="col-span-8 flex flex-col bg-white/[0.01] border border-white/5 rounded-[2.25rem] p-10 overflow-hidden shadow-inner">
                      <div className="flex items-center gap-4 mb-10 opacity-60">
                         <Briefcase className="w-6 h-6" />
                         <h4 className="text-2xl font-bold tracking-tight">Task Assignments</h4>
                      </div>

                      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                          {selectedMemberStats.tasks.length === 0 ? (
                              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                  <div className="w-20 h-20 rounded-full border-2 border-white/5 flex items-center justify-center mb-6 bg-white/[0.02]">
                                      <CheckCircle2 className="w-10 h-10 text-white/5" />
                                  </div>
                                  <p className="text-xl font-medium text-white/20">No tasks currently assigned</p>
                              </div>
                          ) : (
                              selectedMemberStats.tasks.map(task => (
                                  <div key={task.id} className="p-7 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-white/20 hover:bg-white/[0.03] transition-all cursor-pointer">
                                      <div className="flex justify-between items-start mb-4">
                                          <div>
                                              <p className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-brand-gold transition-colors">{task.title}</p>
                                          </div>
                                          <div className={cn(
                                              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                              task.priority === 'critical' ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white/5 border-white/10 text-white/40"
                                          )}>
                                              {task.priority}
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-8 text-white/20 group-hover:text-white/40 transition-colors">
                                          <div className="flex items-center gap-2.5">
                                              <Clock className="w-4 h-4" />
                                              <span className="text-xs font-bold uppercase tracking-widest">{task.dueDate}</span>
                                          </div>
                                          <div className="flex items-center gap-2.5">
                                              <Target className="w-4 h-4" />
                                              <span className="text-xs font-bold uppercase tracking-widest leading-none">{task.status}</span>
                                          </div>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
