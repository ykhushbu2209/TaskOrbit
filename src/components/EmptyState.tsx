import React from 'react';
import { motion } from 'motion/react';
import { Stars, Plus, Target } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export default function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon: Icon = Target 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="relative mb-8">
        <motion.div
           animate={{ 
             scale: [1, 1.2, 1],
             opacity: [0.1, 0.3, 0.1],
             rotate: [0, 90, 0]
           }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute inset-0 bg-brand-gold/20 blur-[60px] rounded-full"
        />
        <div className="w-24 h-24 rounded-[2rem] bg-app-fg/[0.03] border border-app-border flex items-center justify-center relative">
           <Icon className="w-10 h-10 text-app-fg/10" />
           <Stars className="absolute -top-4 -right-4 w-8 h-8 text-brand-gold/20 animate-pulse" />
        </div>
      </div>

      <h3 className="text-2xl font-display font-medium mb-3 tracking-tight">{title}</h3>
      <p className="text-app-fg/30 text-sm max-w-xs mx-auto leading-relaxed font-light mb-8 italic">
        {description}
      </p>

      {actionLabel && (
        <button 
          onClick={onAction}
          className="px-8 py-4 bg-[#f5e6c8] text-brand-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-gold/10 flex items-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
