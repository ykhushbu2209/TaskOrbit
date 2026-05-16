import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Focus,
  Music,
  CheckCircle2,
  Waves
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FocusMode() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-brand-black flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[20%] w-full h-full bg-brand-purple blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[20%] -right-[20%] w-full h-full bg-brand-teal blur-[150px] rounded-full"
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="absolute top-12 right-12 p-3 glass rounded-full hover:bg-white/10 transition-all z-50 text-white/40 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative z-10 text-center max-w-2xl w-full">
        <div className="flex items-center justify-center gap-3 mb-12 text-brand-purple">
          <Focus className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-[0.4em]">Deep Work Active</span>
        </div>

        <motion.div 
            layout
            className="mb-16"
        >
          <h1 className="text-[12rem] font-display font-light tracking-tighter leading-none select-none text-white/90">
            {formatTime(timeLeft)}
          </h1>
          <p className="text-xl text-white/20 mt-4 font-light tracking-widest uppercase">Initializing Focus Core</p>
        </motion.div>

        <div className="flex items-center justify-center gap-8">
            <button 
                onClick={() => setIsActive(!isActive)}
                className="w-20 h-20 rounded-full glass border-2 border-brand-purple/30 flex items-center justify-center hover:bg-brand-purple/10 hover:border-brand-purple transition-all group scale-125"
            >
                {isActive ? <Pause className="w-8 h-8 fill-white/10" /> : <Play className="w-8 h-8 ml-1 fill-white/10" />}
            </button>
            <button 
                onClick={() => { setTimeLeft(25 * 60); setIsActive(false); }}
                className="w-14 h-14 rounded-full glass flex items-center justify-center hover:bg-white/10 text-white/30 hover:text-white transition-all"
            >
                <RotateCcw className="w-5 h-5" />
            </button>
        </div>

        <div className="mt-24 grid grid-cols-3 gap-6">
            <div className="glass p-6 rounded-3xl group cursor-pointer hover:bg-white/5 transition-all text-left border-brand-purple/10">
                <Music className="w-5 h-5 text-brand-purple mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Ambience</p>
                <p className="text-sm font-light mt-1">Deep Space Lofi</p>
            </div>
            <div className="glass p-6 rounded-3xl group cursor-pointer hover:bg-white/5 transition-all text-left border-brand-teal/10">
                <Waves className="w-5 h-5 text-brand-teal mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">White Noise</p>
                <p className="text-sm font-light mt-1">Rainforest Echo</p>
            </div>
            <div className="glass p-6 rounded-3xl group cursor-pointer hover:bg-white/5 transition-all text-left border-white/10">
                <CheckCircle2 className="w-5 h-5 text-white/20 mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Sessions</p>
                <p className="text-sm font-light mt-1">4 of 8 Complete</p>
            </div>
        </div>
      </div>
      
      {/* Dynamic progress ring based on timeLeft */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]">
        <circle 
            cx="50%" 
            cy="50%" 
            r="45%" 
            fill="none" 
            stroke="white" 
            strokeWidth="1" 
            strokeDasharray="10 20"
        />
      </svg>
    </motion.div>
  );
}
