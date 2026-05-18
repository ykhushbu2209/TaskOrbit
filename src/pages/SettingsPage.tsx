import React from 'react';
import { motion } from 'motion/react';
import { User, Shield, Bell, Layout, Globe, Moon, Sun, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function SettingsPage() {
  const { currentUser, settings, setTheme } = useStore();

  return (
    <div className="max-w-4xl space-y-8 pb-12 font-sans">
      <div>
        <h2 className="text-4xl font-display font-bold tracking-tight">System Configuration</h2>
        <p className="text-white/40 mt-1 font-light">Fine-tune your cosmic workspace experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
            {[
                { id: 'profile', label: 'Identity Profile', icon: User },
                { id: 'security', label: 'Security & Access', icon: Shield },
                { id: 'notifications', label: 'Signal Settings', icon: Bell },
                { id: 'appearance', label: 'Visual Interface', icon: Layout },
                { id: 'workspace', label: 'Core Workspace', icon: Globe },
            ].map((item, i) => (
                <button 
                    key={item.id}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${i === 0 ? 'bg-white/5 border border-white/10 text-white' : 'text-white/40 hover:bg-white/[0.02] hover:text-white/60'}`}
                >
                    <div className="flex items-center gap-4">
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/20" />
                </button>
            ))}
        </div>

        <div className="md:col-span-2 space-y-6">
            <div className="glass-morphism rounded-[2.5rem] p-10 border-white/5">
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-24 h-24 rounded-full border-2 border-brand-gold/20 p-1 bg-brand-graphite shadow-2xl relative group cursor-pointer">
                        <img src={currentUser?.avatar} alt={currentUser?.name} className="w-full h-full rounded-full" />
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Zap className="w-6 h-6 text-brand-gold" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold tracking-tight">{currentUser?.name}</h4>
                        <p className="text-white/20 text-sm font-medium mb-4 uppercase tracking-widest">{currentUser?.role} Status: ONLINE</p>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-brand-gold/5 px-3 py-1.5 rounded-lg border border-brand-gold/10 hover:bg-brand-gold hover:text-brand-black transition-all">Update Vector Avatar</button>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 ml-1">Universal Name</label>
                            <input 
                                type="text" 
                                defaultValue={currentUser?.name}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-white/20 transition-all text-sm font-medium tracking-tight"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 ml-1">Email Sector</label>
                            <input 
                                type="email" 
                                defaultValue={currentUser?.email}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-white/20 transition-all text-sm font-medium tracking-tight"
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                         <div className="flex items-center justify-between mb-8">
                             <div>
                                <h5 className="font-bold text-lg tracking-tight">Cosmic Interface</h5>
                                <p className="text-white/20 text-xs font-medium">Dark vs Light energy modes.</p>
                             </div>
                             <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                 <button 
                                    onClick={() => setTheme('light')}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${settings.theme === 'light' ? 'bg-[#f5e6c8] text-brand-black' : 'text-white/40 hover:text-white'}`}
                                 >
                                     <Sun className="w-3.5 h-3.5" />
                                     Light
                                 </button>
                                 <button 
                                    onClick={() => setTheme('dark')}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${settings.theme === 'dark' ? 'bg-[#f5e6c8] text-brand-black' : 'text-white/40 hover:text-white'}`}
                                 >
                                     <Moon className="w-3.5 h-3.5" />
                                     Dark
                                 </button>
                             </div>
                         </div>
                         
                         <div className="space-y-4">
                             {[
                                 { label: 'Hyper-Animations', desc: 'Enable fluid motion engine.', active: true },
                                 { label: 'Signal Broadcasts', desc: 'Realtime session notifications.', active: true },
                                 { label: 'Public Vector', desc: 'Visible profile within the cluster.', active: false },
                             ].map((opt, i) => (
                                 <div key={i} className="flex items-center justify-between py-2">
                                     <div>
                                         <p className="text-sm font-bold tracking-tight">{opt.label}</p>
                                         <p className="text-white/20 text-[11px] font-medium">{opt.desc}</p>
                                     </div>
                                     <button className={`w-10 h-5 rounded-full transition-all relative ${opt.active ? 'bg-brand-gold' : 'bg-white/10'}`}>
                                         <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${opt.active ? 'right-1' : 'left-1'}`} />
                                     </button>
                                 </div>
                             ))}
                         </div>
                    </div>

                    <div className="pt-8 flex justify-end">
                        <button className="px-8 py-4 bg-[#f5e6c8] text-brand-black font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-gold/10">
                            Save Configurations
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
