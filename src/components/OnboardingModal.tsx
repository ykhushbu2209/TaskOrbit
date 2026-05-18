import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Target, Users, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function OnboardingModal() {
  const { currentUser, completeOnboarding } = useStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    role: '',
    teamSize: '1-5',
    goal: ''
  });

  if (!currentUser || currentUser.onboardingCompleted) return null;

  const steps = [
    {
      title: "Define Your Role",
      description: "How will you be navigating the TaskOrbit?",
      icon: Target,
      options: ['Product Lead', 'Core Developer', 'Design Architect', 'Strategic Analyst']
    },
    {
      title: "Team Cluster Size",
      description: "How many agents are in your immediate orbit?",
      icon: Users,
      options: ['Solo Flight', '1-5 Agents', '5-20 Agents', 'Enterprise Wing']
    },
    {
      title: "Primary Objective",
      description: "What is your main mission with TaskOrbit?",
      icon: Rocket,
      options: ['Accelerate Delivery', 'Team Synchronization', 'Strategic Clarity', 'Productivity Boost']
    }
  ];

  const currentStepData = steps[step - 1];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      completeOnboarding(currentUser.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-brand-black/95 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl glass-morphism border-white/10 rounded-[3rem] p-12 relative z-10 overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 blur-[120px] -z-10" />
        
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-3xl bg-brand-gold/5 flex items-center justify-center border border-brand-gold/20 mb-6 relative">
            <currentStepData.icon className="w-8 h-8 text-brand-gold" />
            <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl font-display font-bold tracking-tight mb-3">{currentStepData.title}</h2>
          <p className="text-white/40 font-light tracking-wide">{currentStepData.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12">
          {currentStepData.options.map((option) => {
            const isSelected = Object.values(data).includes(option);
            return (
              <button
                key={option}
                onClick={() => {
                   if (step === 1) setData({...data, role: option});
                   if (step === 2) setData({...data, teamSize: option});
                   if (step === 3) setData({...data, goal: option});
                }}
                className={`p-6 rounded-2xl border transition-all text-left group relative ${
                  isSelected 
                    ? "bg-brand-gold/10 border-brand-gold text-brand-gold" 
                    : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <span className="font-bold tracking-tight">{option}</span>
                {isSelected && (
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
           <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? "w-8 bg-brand-gold" : "w-4 bg-white/10"}`} />
              ))}
           </div>
           
           <button 
             onClick={handleNext}
             className="px-10 py-4 bg-[#f5e6c8] text-brand-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-gold/10 flex items-center gap-2 group"
           >
             {step === 3 ? "Initialize Orbit" : "Next Phase"}
             <Zap className={`w-4 h-4 fill-brand-black transition-transform ${step < 3 ? "group-hover:translate-x-1" : "animate-bounce"}`} />
           </button>
        </div>
      </motion.div>
    </div>
  );
}
