import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function SignupPage() {
  const navigate = useNavigate();
  const registerAdmin = useStore((state) => state.registerAdmin);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role: 'admin' as const,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        status: 'online' as const,
        workload: 'optimal' as const,
      };

      registerAdmin(newUser);
      // Automatically login after signup
      useStore.getState().setCurrentUser(newUser);
      navigate('/admin');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-app-bg text-app-fg relative overflow-hidden px-4 font-sans transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full flex items-center justify-center opacity-20">
         <div className="orbit-ring w-[500px] h-[500px] border-app-border" />
         <div className="orbit-ring w-[800px] h-[800px] border-app-border" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex flex-col items-center mb-12 text-app-fg">
          <div className="w-14 h-14 bg-app-fg/5 border border-app-border rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <ShieldCheck className="w-6 h-6 text-brand-gold fill-app-fg/10" />
          </div>
          <h2 className="text-4xl font-display font-medium tracking-tight mb-2 text-center">
            Register Admin
          </h2>
          <p className="text-app-fg/20 text-sm font-medium tracking-wide text-center">
            Create your command center account.
          </p>
        </div>

        <form onSubmit={handleSignup} className="bg-app-surface border border-app-border rounded-[2rem] p-8 space-y-5 shadow-2xl">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Full Name</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/10 group-focus-within:text-app-fg/40 transition-colors" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-app-fg/[0.03] border border-app-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-gold/30 transition-all text-sm font-medium tracking-tight text-app-fg"
                placeholder="Commander Name"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/10 group-focus-within:text-app-fg/40 transition-colors" />
              <input 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-app-fg/[0.03] border border-app-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-gold/30 transition-all text-sm font-medium tracking-tight text-app-fg"
                placeholder="commander@taskorbit.com"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Access Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/10 group-focus-within:text-app-fg/40 transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-app-fg/[0.03] border border-app-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-gold/30 transition-all text-sm font-medium tracking-tight text-app-fg"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-[10px] text-center font-bold uppercase tracking-widest">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f5e6c8] text-brand-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 shadow-2xl shadow-brand-gold/10 group mt-4"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Zap className="w-5 h-5 fill-black/10" />
              </motion.div>
            ) : (
              <>
                <span className="text-base tracking-tight">Create Account</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <div className="pt-4 flex justify-center">
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="text-app-fg/20 hover:text-app-fg/40 text-[11px] font-medium transition-colors"
            >
              Already have an account? <span className="text-brand-gold/60 hover:text-brand-gold">Sign In</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
