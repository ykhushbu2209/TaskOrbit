import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, UserPlus, Mail, Lock, User, MoreVertical, Trash2, Mail as MailIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function AdminMembersPage() {
  const { users, tasks, addUser, updateUser, deleteUser, updateTask, currentUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignModal, setAssignModal] = useState<{ open: boolean; memberId: string | null }>({
    open: false,
    memberId: null
  });
  
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [editingMember, setEditingMember] = useState<any>(null);

  const members = users.filter(u => u.role === 'member' && u.adminId === currentUser?.id);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (editingMember) {
      updateUser(editingMember.id, {
        name: newName,
        email: newEmail,
        ...(newPassword ? { password: newPassword } : {})
      });
      setEditingMember(null);
    } else {
      const newMember = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        email: newEmail,
        password: newPassword,
        role: 'member' as const,
        adminId: currentUser.id,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`,
        status: 'offline' as const,
        workload: 'optimal' as const,
      };
      addUser(newMember);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setNewName(member.name);
    setNewEmail(member.email);
    setNewPassword(''); // Keep password hidden/empty during edit unless wanting to change
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setEditingMember(null);
  };

  const handleAssignTask = (taskId: string) => {
    if (!assignModal.memberId) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const currentIds = task.assigneeIds || [];
    if (!currentIds.includes(assignModal.memberId)) {
        updateTask(taskId, { assigneeIds: [...currentIds, assignModal.memberId] });
    }
    setAssignModal({ open: false, memberId: null });
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-display font-bold tracking-tight">Team Members</h2>
          <p className="text-white/40 mt-1 font-light">Manage your squad and their access credentials.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#f5e6c8] text-brand-black font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_30px_rgba(245,230,200,0.2)]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="glass-morphism rounded-3xl p-6 border-white/5">
        <div className="relative mb-8 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-gold transition-colors" />
          <input 
            type="text" 
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-gold/30 transition-all font-medium text-sm"
          />
        </div>

        <div className="glass-morphism rounded-3xl overflow-hidden border border-app-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-[10px] uppercase tracking-[0.2em] font-bold text-app-fg/30 bg-app-fg/5">
                <th className="px-6 py-5">Member</th>
                <th className="px-6 py-5">Contact & Role</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              <AnimatePresence>
                {filteredMembers.map((member) => (
                  <motion.tr
                    key={member.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-app-border hover:bg-app-fg/5 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-app-border p-1 bg-app-fg/5 shadow-lg">
                          <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base tracking-tight text-app-fg">{member.name}</h4>
                          <span className="text-[10px] text-app-fg/30 uppercase tracking-widest font-bold font-mono">{member.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-app-fg/60 text-xs">
                          <MailIcon className="w-3 h-3" />
                          {member.email}
                        </div>
                        <div className="text-[9px] text-app-fg/20 font-bold uppercase tracking-widest">Authorized node</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                           <span className={cn(
                               "w-2 h-2 rounded-full",
                               member.status === 'online' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-app-fg/10"
                           )} />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-app-fg/40">{member.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setAssignModal({ open: true, memberId: member.id })}
                          className="px-4 py-2 bg-brand-gold text-brand-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:scale-105 active:scale-95 transition-all"
                        >
                          Assign Task
                        </button>
                        <button 
                          onClick={() => handleEditMember(member)}
                          className="p-2 text-app-fg/20 hover:text-brand-gold transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteUser(member.id)}
                          className="p-2 text-app-fg/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredMembers.length === 0 && (
            <div className="py-20 text-center glass-morphism rounded-3xl">
                <p className="text-app-fg/20 font-medium tracking-tight">No squad members found in this sector.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {assignModal.open && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setAssignModal({ open: false, memberId: null })}
               className="absolute inset-0 bg-black/90 backdrop-blur-sm"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="w-full max-w-lg bg-app-surface border border-app-border rounded-[2.5rem] overflow-hidden p-8 relative z-10"
             >
                <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-display font-bold tracking-tight text-app-fg">Assign Objective</h3>
                      <p className="text-app-fg/40 text-xs mt-1">Select a signal to assign to {users.find(u => u.id === assignModal.memberId)?.name}</p>
                    </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
                  {tasks.filter(t => (t.assigneeIds || []).length === 0).length === 0 && (
                    <p className="text-app-fg/30 text-center py-10 italic">No unassigned signals available.</p>
                  )}
                  {tasks.filter(t => (t.assigneeIds || []).length === 0).map(task => (
                    <button
                      key={task.id}
                      onClick={() => handleAssignTask(task.id)}
                      className="w-full p-6 bg-app-fg/[0.02] border border-app-border rounded-2xl text-left hover:border-brand-gold/30 hover:bg-app-fg/[0.04] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-app-fg group-hover:text-brand-gold transition-colors">{task.title}</h4>
                          <span className="text-[10px] text-app-fg/20 uppercase tracking-widest font-bold tracking-widest">{task.priority} prioridad</span>
                        </div>
                        <Plus className="w-5 h-5 text-app-fg/10 group-hover:text-brand-gold transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => setAssignModal({ open: false, memberId: null })}
                  className="w-full mt-8 py-4 bg-app-fg/5 text-app-fg/40 font-bold rounded-2xl hover:bg-app-fg/10 transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none"
            >
              <div className="w-full max-w-md pointer-events-auto">
                <form onSubmit={handleAddMember} className="glass-morphism rounded-[3rem] p-10 border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 blur-[80px] -z-0 rounded-full translate-x-1/2 -translate-y-1/2 text-brand-gold" />
                  
                  <h3 className="text-3xl font-display font-medium tracking-tight mb-2 text-app-fg">
                      {editingMember ? 'Update Node Credentials' : 'Add New Member'}
                  </h3>
                  <p className="text-app-fg/40 text-sm mb-8 font-medium tracking-wide">
                      {editingMember ? 'Modify access authorizations for this node.' : 'Assign access credentials for your team member.'}
                  </p>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Member Name</label>
                       <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/10 group-focus-within:text-brand-gold transition-colors" />
                         <input 
                            required
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold/20 transition-all font-medium text-sm text-app-fg"
                            placeholder="Full Name"
                         />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Member ID / Email</label>
                       <div className="relative group">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/10 group-focus-within:text-brand-gold transition-colors" />
                         <input 
                            required
                            type="text"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold/20 transition-all font-medium text-sm text-app-fg"
                            placeholder="ID or Email"
                         />
                       </div>
                    </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">
                            {editingMember ? 'Update Password (Leave blank to keep current)' : 'Set Password'}
                        </label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/10 group-focus-within:text-brand-gold transition-colors" />
                          <input 
                             type="password"
                             value={newPassword}
                             onChange={(e) => setNewPassword(e.target.value)}
                             className="w-full bg-app-fg/[0.03] border border-app-border rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold/20 transition-all font-medium text-sm text-app-fg"
                             placeholder="••••••"
                          />
                        </div>
                     </div>

                    <button
                      type="submit"
                      className="w-full bg-[#f5e6c8] text-brand-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-brand-gold/10 mt-4"
                    >
                      {editingMember ? 'Confirm Authorization Updates' : 'Authorize & Create account'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="w-full text-white/20 hover:text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
