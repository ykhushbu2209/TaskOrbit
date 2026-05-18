import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, User as UserIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-app-bg text-app-fg px-4 transition-colors duration-500">
      {/* Background Orbits */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full flex items-center justify-center">
        <div className="orbit-ring w-[300px] h-[300px] border-app-border opacity-20" />
        <div className="orbit-ring w-[600px] h-[600px] border-app-border opacity-10" />
        <div className="orbit-ring w-[900px] h-[900px] border-app-border opacity-5" />
        
        {/* Revolving Avatars */}
        {[...Array(12)].map((_, i) => {
          const ringIndex = i % 4; // 4 distinct rings
          const avatarsPerRing = 3; // 12 total / 4 rings
          const positionInRing = Math.floor(i / 4);
          
          const ringSize = [300, 600, 900, 1200][ringIndex];
          const duration = 30 + ringIndex * 15; // Consistent speed per ring
          // Distribute avatars in the same ring evenly by angle
          const delay = -(positionInRing / avatarsPerRing) * duration;
          
          return (
            <motion.div
              key={i}
              className="absolute"
              animate={{ rotate: 360 }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: ringSize,
                height: ringSize,
              }}
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-1 border border-app-border bg-app-surface shadow-[0_0_30px_rgba(129,140,248,0.1)]"
                style={{
                  width: 32 + ringIndex * 8,
                  height: 32 + ringIndex * 8,
                }}
              >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 40}`} 
                  alt="Team member" 
                  className="w-full h-full rounded-full grayscale-[0.2] hover:grayscale-0 transition-all"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <nav className="fixed top-0 left-0 w-full p-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-2 group">
          <div className="w-10 h-10 glass-morphism rounded-xl flex items-center justify-center group-hover:bg-brand-gold/20 transition-all duration-500 border border-app-border">
            <Zap className="w-5 h-5 text-brand-gold fill-brand-gold/10" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tighter text-app-fg">TaskOrbit</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-app-fg/50 text-sm font-medium">
          {/* Nav links removed as per request */}
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-8 tracking-tight text-app-fg">
            Keep your <br className="md:hidden" /> team <br className="hidden md:block" /> 
            <span className="italic text-gradient-gold">in orbit.</span>
          </h1>
          <p className="text-lg md:text-xl text-app-fg/30 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            A production-grade team management platform designed <br className="hidden md:block" /> 
            for clarity, focus, and quiet confidence.
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link 
            to="/login?role=admin"
            className="group relative px-10 py-5 bg-[#f5e6c8] text-brand-black font-bold rounded-[1.25rem] flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(245,230,200,0.1)]"
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-lg">I'm an Admin</span>
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
          <Link 
            to="/login?role=member"
            className="group px-10 py-5 glass text-white font-bold rounded-[1.25rem] flex items-center gap-3 transition-all hover:bg-white/5 hover:scale-105 active:scale-95"
          >
            <UserIcon className="w-5 h-5 text-white/40" />
            <span className="text-lg">I'm a Team Member</span>
            <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </Link>
        </motion.div>
      </div>

      {/* Footer text removed as per request */}
      
      {/* Footer Ambient Glow */}
      <div className="fixed -bottom-[30%] left-1/2 -translate-x-1/2 w-[80%] h-1/2 bg-brand-purple/20 blur-[120px] pointer-events-none rounded-full" />
    </div>
  );
}
