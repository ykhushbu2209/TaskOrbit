import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { Zap, Activity } from 'lucide-react';

import { User } from '../store/useStore';

interface OrbitVisualizationProps {
  className?: string;
  onMemberClick?: (user: User) => void;
}

export default function OrbitVisualization({ className, onMemberClick }: OrbitVisualizationProps) {
  const { users, tasks, projects } = useStore();

  const getMemberStats = (userId: string) => {
    const memberTasks = tasks.filter(t => (t.assigneeIds || []).includes(userId));
    const memberProjects = projects.filter(p => 
      (p.teamIds || []).includes(userId) || 
      memberTasks.some(t => t.projectId === p.id)
    );
    const completedTasks = memberTasks.filter(t => t.status === 'done').length;
    const activeTasks = memberTasks.filter(t => t.status !== 'done').length;
    
    // Contribution score formula (same as OrbitViewPage)
    const contributionScore = (completedTasks * 15) + (activeTasks * 5) + (memberProjects.length * 10);
    
    return { score: contributionScore };
  };

  const rankedUsers = [...users].sort((a, b) => {
    return getMemberStats(b.id).score - getMemberStats(a.id).score;
  });
  
  return (
    <div className={cn("relative w-full aspect-square flex items-center justify-center overflow-hidden", className)}>
      {/* Background Starfield Simulation */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(40)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-0.5 h-0.5 bg-app-fg rounded-full"
                style={{ 
                    top: `${Math.random() * 100}%`, 
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random()
                }}
              />
          ))}
      </div>

      {/* Orbit Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[30, 45, 60, 75, 90].map((size, idx) => (
          <div 
            key={idx}
            className="absolute border border-app-border rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.01)]"
            style={{ width: `${size}%`, height: `${size}%` }}
          />
        ))}
      </div>

      {/* Header Info (Matching Screenshot) */}
      <div className="absolute top-10 left-10 z-20">
          <div className="flex items-center gap-3 mb-1">
            <Activity className="w-5 h-5 text-app-fg/10" />
             <h3 className="text-3xl font-display font-bold tracking-tight text-app-fg/90">Team Orbit</h3>
          </div>
          <p className="text-[10px] text-app-fg/20 font-bold uppercase tracking-[0.4em]">Elite Contributors in the center orbit</p>
      </div>

      {/* Central Core (Diamond Shape) */}
      <div className="relative z-10">
        <motion.div 
          animate={{
            scale: [1, 1.05, 1],
            rotate: [45, 45, 45]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 bg-app-surface rounded-[2rem] flex items-center justify-center border-app-border border-2 relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rotate-45"
        >
          <div className="absolute inset-0 bg-brand-gold/10 blur-[60px] rounded-full" />
          <div className="flex flex-col items-center rotate-[-45deg] relative z-10">
             <Zap className="w-8 h-8 text-app-fg/10 mb-2" />
             <span className="text-[10px] uppercase tracking-[0.3em] font-extrabold text-app-fg/20 whitespace-nowrap">Orbit Core</span>
          </div>
        </motion.div>
      </div>

      {/* Member Satellites */}
      <AnimatePresence>
        {rankedUsers.map((user, idx) => {
          // Determine ring based on rank (1-4)
          // 0-1 top contributors -> ring 1 (size 45)
          // 2-3 contributors -> ring 2 (size 60)
          // 4-6 contributors -> ring 3 (size 75)
          // etc.
          let ringIdx = 1;
          if (idx >= 15) ringIdx = 4;
          else if (idx >= 8) ringIdx = 3;
          else if (idx >= 3) ringIdx = 2;
          else ringIdx = 1;

          const orbitSize = 30 + (ringIdx * 15);
          const duration = 40 + (ringIdx * 15) + (idx * 2);
          
          // Spread them out based on their rank to avoid clustering
          const initialRotation = (idx * 137.5) % 360; 

          return (
            <motion.div
              key={user.id}
              className="absolute top-1/2 left-1/2 z-20 pointer-events-none"
              animate={{ rotate: 360 + initialRotation }}
              initial={{ rotate: initialRotation }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
              style={{ 
                width: `${orbitSize}%`, 
                height: `${orbitSize}%`,
                marginLeft: `-${orbitSize/2}%`,
                marginTop: `-${orbitSize/2}%`,
              }}
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <div 
                    className="relative cursor-pointer group w-14 h-14 flex items-center justify-center" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onMemberClick?.(user);
                    }}
                >
                   <motion.div 
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                         initial={{ rotate: -initialRotation }}
                         animate={{ 
                             rotate: -(360 + initialRotation) 
                        }}
                        transition={{
                             rotate: {
                                  duration: duration,
                                  repeat: Infinity,
                                  ease: "linear"
                             }
                        }}
                        className="relative p-1 rounded-full bg-brand-black border-2 shadow-lg w-10 h-10 flex items-center justify-center"
                        style={{ 
                            borderColor: user.workload === 'critical' ? '#ef4444' : 
                                        user.workload === 'high' ? '#f59e0b' : 
                                        user.workload === 'optimal' ? '#7c3aed' : '#10b981',
                            boxShadow: `0 0 15px ${user.workload === 'critical' ? 'rgba(239,68,68,0.4)' : 
                                        user.workload === 'high' ? 'rgba(245,158,11,0.4)' : 
                                        user.workload === 'optimal' ? 'rgba(124,58,237,0.4)' : 'rgba(16,185,129,0.4)'}`
                        }}
                   >
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-full h-full rounded-full"
                        />
                        {/* Status Pulse */}
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20" 
                             style={{ 
                                backgroundColor: user.workload === 'critical' ? '#ef4444' : 
                                                user.workload === 'high' ? '#f59e0b' : 
                                                user.workload === 'optimal' ? '#7c3aed' : '#10b981'
                             }} 
                        />
                   </motion.div>
                   
                   {/* Name tag on hover */}
                   <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-app-surface border border-brand-gold/20 px-2 py-1 rounded text-[8px] font-bold text-app-fg whitespace-nowrap pointer-events-none"
                   >
                     {user.name}
                   </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Legend & Workload Capacity (Bottom Matching Screenshot) */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-4">
          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em]">Workload Capacity</p>
          <div className="flex items-center gap-8">
              <LegendItem color="bg-[#ef4444]" label="Critical" />
              <LegendItem color="bg-[#f59e0b]" label="High" />
              <LegendItem color="bg-[#7c3aed]" label="Optimal" />
              <LegendItem color="bg-[#10b981]" label="Low" />
          </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</span>
    </div>
  );
}
