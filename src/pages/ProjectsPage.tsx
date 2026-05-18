import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  MoreVertical, 
  Calendar, 
  LayoutGrid,
  Filter,
  X
} from 'lucide-react';
import { useStore, Project } from '../store/useStore';
import { cn } from '../lib/utils';

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, currentUser, tasks } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStartDate, setNewStartDate] = useState('2026-05-16');
  const [newDeadline, setNewDeadline] = useState('2026-05-31');

  const filteredProjects = projects.filter(p => {
    // Basic search filtering
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Visibility filtering
    if (currentUser?.role === 'admin') return true;
    
    // For members, only show projects where they have assigned tasks
    const memberTasksInProject = tasks.some(t => t.projectId === p.id && (t.assigneeIds || []).includes(currentUser?.id || ''));
    return memberTasksInProject;
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateProject(editingProject.id, {
        name: newName,
        description: newDesc,
        startDate: newStartDate,
        deadline: newDeadline,
      });
      setEditingProject(null);
    } else {
      const project: Project = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        description: newDesc,
        status: 'active',
        progress: 0,
        healthScore: 100,
        managerId: currentUser?.id || '',
        teamIds: [currentUser?.id || ''],
        startDate: newStartDate,
        deadline: newDeadline,
      };
      addProject(project);
    }
    setIsAddProjectModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewDesc('');
    setNewStartDate('2026-05-16');
    setNewDeadline('2026-05-31');
  };

  const handleEdit = (p: Project) => {
    setEditingProject(p);
    setNewName(p.name);
    setNewDesc(p.description);
    setNewStartDate(p.startDate);
    setNewDeadline(p.deadline);
    setIsAddProjectModalOpen(true);
  };

  const getInitialColor = (name: string) => {
    const colors = [
      'bg-purple-500/80',
      'bg-beige-500/80', // I'll use a custom beige-like color or hex
      'bg-brand-gold/80',
      'bg-blue-500/80',
      'bg-emerald-500/80'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="space-y-10 pb-12 font-sans px-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-display font-medium tracking-tight text-app-fg mb-3">Projects</h1>
          <p className="text-app-fg/40 text-lg font-medium tracking-wide">Manage and organize your team's workspace.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/20 group-focus-within:text-brand-gold transition-colors" />
            <input 
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-app-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-gold/20 transition-all font-medium text-app-fg shadow-2xl"
            />
          </div>
          
          <button className="p-3 bg-[#0a0a0a] border border-app-border rounded-xl text-app-fg/40 hover:text-app-fg transition-all shadow-2xl">
            <Filter className="w-5 h-5" />
          </button>
          
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setIsAddProjectModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#f5e6c8] text-brand-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-[#0f0f0f]/40 border border-app-border rounded-[2.5rem] p-9 group hover:border-brand-gold/10 transition-all relative overflow-hidden flex flex-col min-h-[360px]"
            >
              <div className="flex items-start justify-between mb-10 relative z-10">
                <div className={cn(
                  "w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl font-display font-medium text-brand-black",
                  project.name.startsWith('R') ? 'bg-[#ac94f1]' : 
                  project.name.startsWith('Q') ? 'bg-[#f5e6c8]' : 
                  'bg-brand-gold'
                )}>
                  {project.name.charAt(0)}
                </div>
                <div className="flex items-center gap-1 group relative">
                    <button className="p-2 text-app-fg/10 hover:text-app-fg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {currentUser?.role === 'admin' && (
                        <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-app-surface border border-app-border rounded-xl shadow-2xl p-2 z-[20]">
                            <button 
                                onClick={() => handleEdit(project)}
                                className="w-full text-left px-4 py-2 hover:bg-app-fg/5 rounded-lg text-sm transition-colors text-app-fg"
                            >
                                Edit Project
                            </button>
                            <button 
                                onClick={() => deleteProject(project.id)}
                                className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-lg text-sm transition-colors"
                            >
                                Delete Project
                            </button>
                        </div>
                    )}
                </div>
              </div>

              <div className="mb-auto relative z-10">
                <h3 className="text-3xl font-bold text-app-fg mb-3 group-hover:text-brand-gold transition-colors tracking-tight">{project.name}</h3>
                <p className="text-app-fg/30 text-base font-medium leading-relaxed line-clamp-2">{project.description}</p>
              </div>

              <div className="mt-12 relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-app-fg/20">Progress</span>
                  <span className="text-base font-bold text-app-fg">{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-app-fg/5 rounded-full overflow-hidden mb-8">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    className="h-full bg-brand-gold rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-app-border/40">
                  <div className="flex items-center gap-2.5 text-[11px] font-bold text-app-fg/20 uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    {project.startDate}
                  </div>
                  <div className="flex items-center gap-2.5 text-[11px] font-bold text-app-fg/20 uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    {project.deadline}
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-brand-gold/[0.01] opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddProjectModalOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-app-surface border border-app-border rounded-[3rem] p-10 relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[100px] -z-0 rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-3xl font-display font-medium tracking-tight text-app-fg">
                    {editingProject ? 'Edit Project' : 'New Project'}
                </h3>
                <button 
                  onClick={() => {
                    setIsAddProjectModalOpen(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="p-2 text-app-fg/20 hover:text-app-fg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Project Name</label>
                  <input 
                    required
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Neural Nexus"
                    className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-gold/20 transition-all font-medium text-app-fg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Description</label>
                  <textarea 
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Briefly describe the objective..."
                    rows={4}
                    className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-gold/20 transition-all font-medium text-app-fg resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Start Date</label>
                    <input 
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-gold/20 transition-all font-medium text-app-fg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Deadline</label>
                    <input 
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-gold/20 transition-all font-medium text-app-fg"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 bg-[#f5e6c8] text-brand-black font-bold py-5 rounded-2xl hover:scale-102 active:scale-98 transition-all shadow-xl text-lg"
                >
                  {editingProject ? 'Update Orbit' : 'Create Orbit'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
