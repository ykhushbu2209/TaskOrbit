import React from 'react';
import { motion } from 'motion/react';
import { Orbit, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-brand-black px-4">
      {/* Background Orbits */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full">
        <div className="orbit-ring w-[300px] h-[300px] opacity-20" />
        <div className="orbit-ring w-[600px] h-[600px] opacity-10" />
        <div className="orbit-ring w-[900px] h-[900px] opacity-5" />
        
        {/* Floating Avatars */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full p-0.5 border border-white/20 bg-brand-graphite shadow-[0_0_20px_rgba(139,92,246,0.2)]"
            animate={{
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
              width: 40 + Math.random() * 20,
              height: 40 + Math.random() * 20,
            }}
          >
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
              alt="Team member" 
              className="w-full h-full rounded-full"
            />
          </motion.div>
        ))}
      </div>

      <nav className="fixed top-0 left-0 w-full p-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-2 group">
          <div className="w-10 h-10 glass-morphism rounded-xl flex items-center justify-center group-hover:bg-brand-purple/20 transition-all duration-500">
            <Orbit className="w-6 h-6 text-brand-purple" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">TaskOrbit</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-white/50 text-sm font-medium">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Design</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          <div className="h-4 w-px bg-white/10" />
          <Link to="/login" className="px-5 py-2 glass rounded-full hover:bg-white/10 transition-all">Sign In</Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight mb-8">
            Keep your team <br />
            <span className="italic text-gradient-gold">in orbit.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/40 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            A production-grade team management platform designed for clarity, focus, and quiet confidence.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link 
            to="/login?role=admin"
            className="group relative px-8 py-4 bg-brand-gold text-brand-black font-bold rounded-2xl flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(251,191,36,0.3)]"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>I'm an Admin</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
          <Link 
            to="/login?role=member"
            className="group px-8 py-4 glass text-white font-bold rounded-2xl flex items-center gap-3 transition-all hover:bg-white/10 hover:scale-105 active:scale-95"
          >
            <UserIcon className="w-5 h-5 text-brand-purple" />
            <span>I'm a Team Member</span>
          </Link>
        </motion.div>
      </div>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 text-[10px] uppercase tracking-widest text-white/20 font-bold">
        <span>Cinematic Workflow</span>
        <div className="w-1 h-1 rounded-full bg-brand-purple" />
        <span>Quantum Scheduling</span>
        <div className="w-1 h-1 rounded-full bg-brand-purple" />
        <span>AI Orchestration</span>
      </div>
      
      {/* Footer Ambient Glow */}
      <div className="fixed -bottom-[30%] left-1/2 -translate-x-1/2 w-[80%] h-1/2 bg-brand-purple/20 blur-[120px] pointer-events-none rounded-full" />
    </div>
  );
}
