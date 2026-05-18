import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, Zap, CheckCircle2, Layout, Settings, MessageSquare, User, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { id: 'dashboard', title: 'Dashboard', icon: Layout, action: () => navigate(currentUser?.role === 'admin' ? '/admin' : '/member') },
    { id: 'tasks', title: 'My Tasks', icon: CheckCircle2, action: () => navigate('/member/tasks') },
    { id: 'analytics', title: 'Analytics', icon: TrendingUp, action: () => navigate('/admin/analytics') },
    { id: 'focus', title: 'Focus Mode', icon: Zap, action: () => navigate('/focus') },
    { id: 'messages', title: 'Transmissions', icon: MessageSquare, action: () => navigate('/messages') },
    { id: 'settings', title: 'Settings', icon: Settings, action: () => navigate('/settings') },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <div className="glass-morphism rounded-[2rem] border-white/10 shadow-2xl overflow-hidden">
              <div className="relative group">
                <Search className="absolute left-6 top-6 w-5 h-5 text-white/20 group-focus-within:text-brand-gold transition-colors" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Execute command or search cosmic data..."
                  className="w-full bg-transparent border-b border-white/5 py-6 pl-16 pr-6 text-xl font-display focus:outline-none placeholder:text-white/10"
                />
              </div>

              <div className="max-h-80 overflow-y-auto p-4 custom-scrollbar">
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Global Actions</div>
                <div className="space-y-1">
                  {filteredCommands.map((command) => (
                    <button
                      key={command.id}
                      onClick={() => {
                        command.action();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-black transition-all">
                          <command.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-white/60 group-hover:text-white transition-colors">
                          {command.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                         <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-white/20 font-bold uppercase tracking-widest">Enter</span>
                      </div>
                    </button>
                  ))}
                  {filteredCommands.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-white/20 text-sm font-medium tracking-tight">No cosmic sequence found for "{query}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    <span className="p-1 px-1.5 bg-white/5 rounded border border-white/10 text-white/40">ESC</span>
                    Cancel
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                    <span className="p-1 px-1.5 bg-white/5 rounded border border-white/10 text-white/40">↑↓</span>
                    Navigate
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-brand-gold/60 uppercase tracking-widest">
                   TaskOrbit V2.0
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
