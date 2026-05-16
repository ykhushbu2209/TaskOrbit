import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Search, 
  Circle,
  Hash,
  Video,
  Phone,
  Info
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function MessagesPage() {
  const { users, currentUser } = useStore();
  const [selectedUser, setSelectedUser] = useState<string | null>(users[1]?.id);
  const [message, setMessage] = useState('');
  
  const activeUser = users.find(u => u.id === selectedUser);

  return (
    <div className="h-[calc(100vh-160px)] glass-morphism rounded-3xl overflow-hidden flex">
      {/* Sidebar - Contacts */}
      <div className="w-80 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-purple transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search transmissions..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none transition-all"
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar py-4">
            <div className="px-6 mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4">Channels</h3>
                <div className="space-y-1">
                    {['announcements', 'engineering', 'design-system'].map(channel => (
                        <button key={channel} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:bg-white/5 transition-all text-sm font-medium">
                            <Hash className="w-4 h-4" />
                            <span>{channel}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-4 mt-6">Direct Transmissions</h3>
                <div className="space-y-1">
                    {users.filter(u => u.id !== currentUser?.id).map(user => (
                        <button 
                            key={user.id}
                            onClick={() => setSelectedUser(user.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                                selectedUser === user.id ? "bg-brand-purple/10 text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="relative w-8 h-8 rounded-full border border-white/10 p-0.5">
                                <img src={user.avatar} className="w-full h-full rounded-full" />
                                <div className={cn(
                                    "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-brand-graphite",
                                    user.status === 'online' ? "bg-green-500" : "bg-gray-500"
                                )} />
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-bold truncate">{user.name}</p>
                                <p className="text-[10px] opacity-40 uppercase truncate tracking-tighter">{user.role}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {activeUser ? (
            <>
                <div className="h-20 border-b border-white/5 px-8 flex items-center justify-between glass/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-white/10 p-0.5">
                            <img src={activeUser.avatar} className="w-full h-full rounded-full" />
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-tight">{activeUser.name}</p>
                            <div className="flex items-center gap-2">
                                <Circle className="w-1.5 h-1.5 fill-green-500 text-green-500" />
                                <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Encrypted Link Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/20">
                        <button className="p-2 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Phone className="w-5 h-5" /></button>
                        <button className="p-2 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Video className="w-5 h-5" /></button>
                        <div className="w-px h-6 bg-white/5" />
                        <button className="p-2 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Info className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                    <div className="flex justify-center mb-8">
                        <span className="text-[10px] glass px-3 py-1 rounded-full uppercase tracking-widest font-bold text-white/20">May 16, 2026</span>
                    </div>

                    <Message 
                        user={activeUser} 
                        content="The orbit engine integration is complete on the staging cluster. Ready for your review." 
                        time="02:14 PM" 
                    />
                    <Message 
                        user={currentUser!} 
                        content="Excellent precision, Sarah. I'll initiate the validation sequence now. Have you monitored the workload spikes?" 
                        time="02:15 PM" 
                        isMe 
                    />
                    <Message 
                        user={activeUser} 
                        content="Confirmed. Spikes remained within optimal luxury thresholds. No burnout detected." 
                        time="02:18 PM" 
                    />
                </div>

                <div className="p-8 border-t border-white/5">
                    <div className="relative group">
                        <input 
                            type="text" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`Broadcast to ${activeUser.name.split(' ')[0]}...`}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 flex pl-6 pr-14 focus:outline-none focus:ring-1 focus:ring-brand-purple/20 transition-all font-light"
                        />
                        <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-brand-purple rounded-xl text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-purple/20"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 glass-morphism rounded-3xl flex items-center justify-center mb-6 animate-float">
                    <MessageSquare className="w-10 h-10 text-white/10" />
                </div>
                <h3 className="text-2xl font-display font-bold">Select a Cluster</h3>
                <p className="text-white/20 font-light mt-2">Pick a team member or channel to begin transmission.</p>
            </div>
        )}
      </div>
    </div>
  );
}

function Message({ user, content, time, isMe = false }: { user: any, content: string, time: string, isMe?: boolean }) {
    return (
        <div className={cn("flex gap-4 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
            <div className="w-8 h-8 rounded-full border border-white/10 p-0.5 mt-1 shrink-0">
                <img src={user.avatar} className="w-full h-full rounded-full" />
            </div>
            <div className={cn("space-y-1", isMe ? "text-right" : "")}>
                <div className={cn(
                    "p-4 rounded-2xl text-sm font-light leading-relaxed",
                    isMe ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/10" : "glass text-white/80"
                )}>
                    {content}
                </div>
                <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{time}</p>
            </div>
        </div>
    );
}

import { MessageSquare } from 'lucide-react';
