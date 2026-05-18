import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, Brain, Activity } from 'lucide-react';

interface AISimulatorProps {
  onComplete?: (result: string) => void;
  trigger?: boolean;
}

export default function AISimulator({ onComplete, trigger }: AISimulatorProps) {
  const [status, setStatus] = useState<'idle' | 'thinking' | 'typing' | 'completed'>('idle');
  const [displayText, setDisplayText] = useState('');
  const fullText = "Based on current velocity and workload distribution, I recommend re-assigning 'Project Nexus' tasks to Sarah to maintain optimal sprint health. Strategic alignment is currently at 94%.";

  useEffect(() => {
    if (trigger && status === 'idle') {
      startSimulation();
    }
  }, [trigger]);

  const startSimulation = () => {
    setStatus('thinking');
    setTimeout(() => {
      setStatus('typing');
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(interval);
          setStatus('completed');
          if (onComplete) onComplete(fullText);
        }
      }, 30);
    }, 2000);
  };

  if (status === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-morphism rounded-[2rem] p-8 border-brand-gold/20 shadow-2xl shadow-brand-gold/5 overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 p-4">
             <div className="flex gap-1">
                 {[1, 2, 3].map(i => (
                     <motion.div 
                        key={i}
                        animate={{ height: [4, 12, 4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1 bg-brand-gold/40 rounded-full"
                     />
                 ))}
             </div>
        </div>

        <div className="flex items-start gap-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-brand-gold/5 flex items-center justify-center border border-brand-gold/20 relative">
            <Brain className="w-6 h-6 text-brand-gold" />
            {status === 'thinking' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-t-brand-gold border-r-transparent border-b-transparent border-l-transparent rounded-2xl"
              />
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xl font-bold tracking-tight">AI Strategic Analyzer</h4>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">TaskOrbit Intelligence Layer</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <Activity className="w-3 h-3 text-brand-gold" />
                    <span className="text-[9px] font-bold text-white/40 uppercase">Realtime Synapse</span>
                </div>
            </div>

            <div className="min-h-[60px] text-sm text-white/60 leading-relaxed font-light italic">
              {status === 'thinking' ? (
                <div className="flex items-center gap-2">
                  <span className="text-white/20">Scanning project cluster...</span>
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-1.5 h-4 bg-brand-gold/40 rounded-full"
                  />
                </div>
              ) : (
                <p>
                    {displayText}
                    {status === 'typing' && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-1.5 h-4 bg-brand-gold ml-1 translate-y-0.5" />}
                </p>
              )}
            </div>

            {status === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 pt-4"
              >
                <button className="px-5 py-2 bg-brand-gold text-brand-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:scale-105 transition-all">
                   Execute Optimization
                </button>
                <button 
                  onClick={() => { setStatus('idle'); setDisplayText(''); }}
                  className="px-5 py-2 glass text-white/40 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:text-white transition-all"
                >
                   Dismiss
                </button>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Decorative background glow */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-gold/5 blur-[60px] rounded-full pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}
