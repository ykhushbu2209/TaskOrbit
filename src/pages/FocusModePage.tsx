import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Zap, ChevronLeft, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FocusModePage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-[#020202] text-brand-ivory z-[100] flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold rounded-full blur-[200px]" 
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
      </div>

      <nav className="absolute top-10 left-10 z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-white/20 hover:text-white transition-all group font-bold uppercase tracking-[0.2em] text-[10px]"
        >
          <div className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white/5 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </div>
          Abort Session
        </button>
      </nav>

      <div className="absolute top-10 right-10 z-10">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      <div className="relative flex flex-col items-center z-10 w-full max-w-lg px-8">
        <div className="mb-12 text-center">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 justify-center mb-4"
            >
                <div className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(245,230,200,1)] animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">Focus Transmission</span>
            </motion.div>
            <h2 className="text-xl font-display font-medium text-white/40 tracking-tight">Core Task: Interface Polish</h2>
        </div>

        <div className="relative w-80 h-80 flex items-center justify-center mb-20">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="rgba(255,255,255,0.02)"
              strokeWidth="4"
              className="translate-x-[-15px] translate-y-[-15px]"
            />
            <motion.circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="#f5e6c8"
              strokeWidth="4"
              strokeDasharray="942"
              animate={{ strokeDashoffset: 942 - (942 * progress) / 100 }}
              className="translate-x-[-15px] translate-y-[-15px] drop-shadow-[0_0_8px_rgba(245,230,200,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-7xl font-display font-medium tabular-nums tracking-tighter">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mt-2">Remaining</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              setTimeLeft(25 * 60);
              setIsActive(false);
            }}
            className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setIsActive(!isActive)}
            className="w-24 h-24 rounded-full bg-[#f5e6c8] text-brand-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-brand-gold/20"
          >
            {isActive ? <Pause className="w-8 h-8 fill-brand-black" /> : <Play className="w-8 h-8 fill-brand-black translate-x-1" />}
          </button>

          <button className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">
             <Zap className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-24 w-full flex justify-between items-center px-4">
             <div className="text-center">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Session</p>
                 <p className="text-sm font-medium">01 / 04</p>
             </div>
             <div className="text-center">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Focus Points</p>
                 <p className="text-sm font-medium text-brand-gold">+240</p>
             </div>
             <div className="text-center">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Intention</p>
                 <p className="text-sm font-medium">Deep Work</p>
             </div>
        </div>
      </div>
    </div>
  );
}
