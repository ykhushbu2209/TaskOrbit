import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Orbit, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [email, setEmail] = useState(roleParam === 'admin' ? 'admin@taskorbit.com' : 'member@taskorbit.com');
  const [password, setPassword] = useState('TaskOrbit123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const users = useStore((state) => state.users);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = users.find(u => u.email === email && password === 'TaskOrbit123');
      if (user) {
        setCurrentUser(user);
        navigate(user.role === 'admin' ? '/admin' : '/member');
      } else {
        setError('Invalid credentials. Use provided demo accounts.');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-brand-black relative overflow-hidden px-4">
      {/* Background Orbits */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orbit-ring w-[400px] h-[400px] opacity-10 scale-150" />
        <div className="orbit-ring w-[800px] h-[800px] opacity-5 scale-150" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 glass-morphism rounded-2xl flex items-center justify-center mb-4">
            <Orbit className="w-8 h-8 text-brand-purple" />
          </div>
          <h2 className="text-3xl font-display font-bold">
            {roleParam === 'admin' ? 'Admin Login' : 'Team Access'}
          </h2>
          <p className="text-white/40 font-light mt-2">Sign in to manage your team.</p>
        </div>

        <form onSubmit={handleLogin} className="glass-morphism rounded-3xl p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-purple transition-colors" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-brand-purple/50 transition-all"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-brand-purple transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-brand-purple/50 transition-all"
                placeholder="********"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-brand-gold to-orange-400 text-brand-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Orbit className="w-5 h-5" />
              </motion.div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <div className="flex flex-col gap-4 items-center">
            <button 
              type="button"
              onClick={() => {
                const isMember = email.includes('member');
                setEmail(isMember ? 'admin@taskorbit.com' : 'member@taskorbit.com');
              }}
              className="text-white/30 hover:text-brand-purple text-sm flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Switch to {email.includes('member') ? 'Admin' : 'Member'} demo account</span>
            </button>
            <p className="text-white/20 text-xs">
              Don't have an account? <span className="text-brand-gold cursor-pointer hover:underline">Create an Account</span>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
