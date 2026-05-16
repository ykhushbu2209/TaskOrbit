import React from 'react';
import { motion } from 'motion/react';
import { useStore, User } from '../store/useStore';
import { cn } from '../lib/utils';
import { Zap } from 'lucide-react';

interface OrbitVisualizationProps {
  className?: string;
}

export default function OrbitVisualization({ className }: OrbitVisualizationProps) {
  const users = useStore((state) => state.users);
  
  const getStatusColor = (workload: User['workload']) => {
    switch (workload) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'optimal': return 'bg-brand-purple';
      case 'low': return 'bg-brand-teal';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={cn("relative aspect-square w-full max-w-2xl mx-auto flex items-center justify-center p-8", className)}>
      {/* Central Core */}
      <div className="relative z-10">
        <motion.div 
          animate={{
            boxShadow: [
              '0 0 40px rgba(139, 92, 246, 0.2)',
              '0 0 80px rgba(139, 92, 246, 0.5)',
              '0 0 40px rgba(139, 92, 246, 0.2)'
            ],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-24 h-24 glass-morphism rounded-[2rem] rotate-45 flex items-center justify-center border-brand-purple/30 border-2"
        >
          <div className="-rotate-45 flex flex-col items-center">
            <Zap className="w-8 h-8 text-white fill-white/10" />
            <span className="text-[10px] uppercase tracking-tighter font-bold text-white/50 mt-1">Orbit Core</span>
          </div>
        </motion.div>
        
        {/* Core Glow */}
        <div className="absolute inset-0 bg-brand-purple/20 blur-3xl -z-10" />
      </div>

      {/* Orbit Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[40, 65, 90].map((size, idx) => (
          <div 
            key={idx}
            className="absolute border border-white/5 rounded-full"
            style={{ width: `${size}%`, height: `${size}%` }}
          />
        ))}
      </div>

      {/* Animated Members */}
      {users.map((user, idx) => {
        // Distribute users on rings
        const ring = (idx % 3) + 1;
        const ringSize = [40, 65, 90][ring - 1];
        const duration = 20 + idx * 5;
        const delay = -idx * (duration / users.length);

        return (
          <motion.div
            key={user.id}
            className="absolute top-1/2 left-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
            style={{ 
              width: `${ringSize}%`, 
              height: `${ringSize}%`,
              marginLeft: `-${ringSize/2}%`,
              marginTop: `-${ringSize/1.9}%`, // Slight offset to make center perfect
            }}
          >
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
            >
              <div className="relative">
                {/* Visual indicator of workload */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={cn("absolute -inset-2 rounded-full blur-md -z-10", getStatusColor(user.workload))}
                />
                
                <div className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5 bg-brand-graphite overflow-hidden cursor-pointer hover:border-brand-purple transition-colors relative">
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
                  
                  {/* Status dot */}
                  <div className={cn(
                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-brand-graphite",
                    user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  )} />
                </div>

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="glass-morphism rounded-xl px-3 py-2 whitespace-nowrap">
                    <p className="text-xs font-bold">{user.name}</p>
                    <p className="text-[10px] text-white/50 uppercase">{user.workload} Workload</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Orbit Labels */}
      <div className="absolute top-8 left-8">
        <h3 className="text-2xl font-display font-bold flex items-center gap-2">
          <div className="w-4 h-[2px] bg-brand-purple/50" />
          Team Orbit
        </h3>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">Elite contributors in the center orbit</p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
        <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2">Workload Capacity</span>
             <div className="flex gap-4">
                <LegendItem color="bg-red-500" label="Critical" />
                <LegendItem color="bg-orange-500" label="High" />
                <LegendItem color="bg-brand-purple" label="Optimal" />
                <LegendItem color="bg-brand-teal" label="Low" />
             </div>
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
