import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const users = useStore((state) => state.users);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setCurrentUser(user);
        navigate(user.role === 'admin' ? '/admin' : '/member');
      } else {
        setError('Invalid credentials. Access Denied.');
      }
      setLoading(false);
    }, 1200);
  };

  const handleDemoLogin = () => {
    setEmail('demo@taskorbit.com');
    setPassword('TaskOrbit123');
    setLoading(true);
    
    setTimeout(() => {
      // Ensure demo user exists in store
      const demoUser = users.find(u => u.email === 'demo@taskorbit.com');
      if (demoUser) {
        setCurrentUser(demoUser);
        navigate('/admin');
      } else {
        // Fallback for first run if mock data is somehow missing
        const fallbackDemo = {
          id: 'demo-id',
          name: 'Demo Admin',
          email: 'demo@taskorbit.com',
          password: 'TaskOrbit123',
          role: 'admin' as const,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
          status: 'online' as const,
          workload: 'optimal' as const,
        };
        useStore.getState().registerAdmin(fallbackDemo);
        setCurrentUser(fallbackDemo);
        navigate('/admin');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-app-bg relative overflow-hidden px-4 font-sans text-app-fg transition-colors duration-500">
      {/* Revolving Avatars Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full flex items-center justify-center opacity-40">
        <div className="orbit-ring w-[300px] h-[300px] border-app-border" />
        <div className="orbit-ring w-[600px] h-[600px] border-app-border" />
        <div className="orbit-ring w-[900px] h-[900px] border-app-border" />
        
        {[...Array(8)].map((_, i) => {
          const ringIndex = i % 3;
          const ringSize = [300, 600, 900][ringIndex];
          const duration = 40 + ringIndex * 20;
          const delay = -i * (duration / 8);
          
          return (
            <motion.div
              key={i}
              className="absolute"
              animate={{ rotate: 360 }}
              transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
              style={{ width: ringSize, height: ringSize }}
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-1 border border-app-border bg-app-surface shadow-2xl"
                style={{ width: 35, height: 35 }}
              >
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 60}`} 
                  alt="" 
                  className="w-full h-full rounded-full transition-all opacity-60"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-14 h-14 bg-app-fg/5 border border-app-border rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <Zap className="w-6 h-6 text-app-fg fill-app-fg/10" />
          </div>
          <h2 className="text-4xl font-display font-medium tracking-tight mb-2 text-app-fg">
            {roleParam === 'admin' ? 'Admin Login' : 'Team Login'}
          </h2>
          <p className="text-app-fg/20 text-sm font-medium tracking-wide">
            {roleParam === 'admin' ? 'Sign in to manage your team.' : 'Access your focus chamber.'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-app-surface border border-app-border rounded-[2rem] p-8 space-y-6 shadow-2xl">
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Member ID or Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/10 group-focus-within:text-app-fg/40 transition-colors" />
              <input 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-app-fg/[0.03] border border-app-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold/30 transition-all text-sm font-medium tracking-tight text-app-fg"
                placeholder="ID or Email"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-app-fg/20 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/10 group-focus-within:text-app-fg/40 transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-app-fg/[0.03] border border-app-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold/30 transition-all text-sm font-medium tracking-tight text-app-fg"
                placeholder="••••••"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-400 text-[10px] text-center font-bold uppercase tracking-widest bg-red-400/5 py-2 rounded-lg border border-red-400/10"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f5e6c8] text-brand-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 shadow-2xl shadow-brand-gold/10 group"
          >
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Zap className="w-5 h-5 fill-black/10" />
              </motion.div>
            ) : (
              <>
                <span className="text-base tracking-tight">Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-app-border"></div></div>
             <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]"><span className="bg-app-surface px-4 text-app-fg/10 uppercase tracking-widest">or</span></div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-app-fg/[0.03] border border-app-border text-app-fg/60 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-app-fg/5 active:scale-98 transition-all group shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-brand-gold group-hover:animate-pulse" />
            <span className="text-sm tracking-tight">Try Demo Account</span>
          </button>
          
          <div className="pt-4 flex flex-col items-center gap-3">
            <button 
              type="button"
              onClick={() => { navigate('/login?role=' + (roleParam === 'admin' ? 'member' : 'admin')); }}
              className="text-app-fg/20 hover:text-app-fg/40 text-[11px] font-medium transition-colors"
            >
              Switch to {roleParam === 'admin' ? 'Member' : 'Admin'} Login
            </button>
            {roleParam === 'admin' && (
              <button 
                type="button"
                onClick={() => navigate('/signup')}
                className="text-app-fg/20 hover:text-app-fg/40 text-[11px] font-medium transition-colors"
              >
                Don't have an account? <span className="text-brand-gold/60 hover:text-brand-gold">Register Admin</span>
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
