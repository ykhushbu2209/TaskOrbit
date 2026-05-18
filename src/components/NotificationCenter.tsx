import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Zap, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications } = useStore();
  
  const mockNotifications = [
    { id: '1', type: 'system', title: 'Cosmic Sync Complete', message: 'All project data has been synchronized with the core.', time: '2m ago', read: false },
    { id: '2', type: 'task', title: 'Task Assigned', message: 'Alex Rivera assigned "Design System Polish" to you.', time: '15m ago', read: false },
    { id: '3', type: 'alert', title: 'Critical Deadline', message: 'Project "Neural Nexus" is approaching its deadline in 48 hours.', time: '1h ago', read: true },
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white relative group transition-colors"
      >
        <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-gold rounded-full border border-brand-black shadow-[0_0_10px_rgba(245,230,200,0.5)]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[40]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-4 w-96 glass-morphism border-white/5 rounded-[2rem] shadow-2xl z-[50] overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-lg tracking-tight">Signal Center</h3>
                <button className="text-[10px] font-bold uppercase tracking-widest text-brand-gold hover:text-[#f5e6c8] transition-colors">Mark all read</button>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {mockNotifications.map((n) => (
                  <div 
                    key={n.id}
                    className={cn(
                        "p-6 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors flex gap-4 group cursor-pointer",
                        !n.read && "bg-brand-gold/[0.02]"
                    )}
                  >
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                        n.type === 'alert' ? "bg-red-500/5 border-red-500/20 text-red-400" : 
                        n.type === 'task' ? "bg-blue-500/5 border-blue-500/20 text-blue-400" :
                        "bg-brand-gold/5 border-brand-gold/20 text-brand-gold"
                    )}>
                        {n.type === 'alert' ? <AlertTriangle className="w-4 h-4" /> : 
                         n.type === 'task' ? <CheckCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className={cn("text-sm font-bold truncate", n.read ? "text-white/60" : "text-white")}>{n.title}</p>
                        <span className="text-[9px] font-bold text-white/20 uppercase whitespace-nowrap ml-2">{n.time}</span>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/[0.02] text-center">
                 <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors">View All Signals</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
