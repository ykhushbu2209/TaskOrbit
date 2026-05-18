import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Orbit, 
  LayoutDashboard, 
  Briefcase, 
  CheckCircle2, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  Zap
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import CommandPalette from './CommandPalette';

import NotificationCenter from './NotificationCenter';
import OnboardingModal from './OnboardingModal';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser, settings, setTheme } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLG, setIsLG] = React.useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      setIsLG(e.matches);
      if (e.matches) setIsMobileMenuOpen(false);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!currentUser) return null;

  const adminLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Projects', icon: Briefcase, path: '/admin/projects' },
    { name: 'Tasks', icon: CheckCircle2, path: '/admin/tasks' },
    { name: 'Analytics', icon: Zap, path: '/admin/analytics' },
    { name: 'Members', icon: Users, path: '/admin/members' },
    { name: 'Messages', icon: MessageSquare, path: '/admin/messages' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const memberLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/member' },
    { name: 'Projects', icon: Briefcase, path: '/member/projects' },
    { name: 'My Tasks', icon: CheckCircle2, path: '/member/tasks' },
    { name: 'Focus Mode', icon: Zap, path: '/focus' },
    { name: 'Messages', icon: MessageSquare, path: '/member/messages' },
    { name: 'Settings', icon: Settings, path: '/member/settings' },
  ];

  const links = currentUser.role === 'admin' ? adminLinks : memberLinks;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className={cn(
      "flex h-screen bg-app-bg text-app-fg overflow-hidden selection:bg-brand-gold/30 selection:text-white font-sans transition-colors duration-300",
      settings.theme === 'light' && "light"
    )}>
      <CommandPalette />
      <OnboardingModal />
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-app-bg/80 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isSidebarCollapsed ? 90 : 300,
          x: isLG ? 0 : (isMobileMenuOpen ? 0 : -300)
        }}
        className={cn(
          "fixed lg:relative h-full bg-app-surface border-r border-app-border z-50 flex flex-col transition-all duration-300 shadow-2xl lg:shadow-none",
          !isLG && !isMobileMenuOpen && "pointer-events-none"
        )}
      >
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 min-w-10 glass-morphism rounded-xl flex items-center justify-center border-brand-gold/10">
            <Zap className="w-5 h-5 text-brand-ivory fill-white/10" />
          </div>
          {!isSidebarCollapsed && (
            <span className="text-2xl font-display font-bold tracking-tighter">TaskOrbit</span>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-4 px-6 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                  isActive 
                    ? "text-[#f5e6c8] border-white ring-1 ring-white/20" 
                    : "text-app-fg/30 hover:text-app-fg/60 border-transparent"
                )}
              >
                <link.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[#f5e6c8]" : "group-hover:text-app-fg/60")} />
                {!isSidebarCollapsed && (
                  <span className="text-[15px] font-medium tracking-tight">{link.name}</span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute inset-0 bg-app-fg/[0.05] border border-app-border -z-10 shadow-[0_0_30px_rgba(245,230,200,0.02)]"
                    style={{ borderRadius: '1.25rem' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2 text-white/40">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!isSidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
          
          <button 
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full flex items-center gap-4 px-4 py-3 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
          >
            <ChevronLeft className={cn("w-5 h-5 transition-transform", isSidebarCollapsed && "rotate-180")} />
            {!isSidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-app-border flex items-center justify-between px-4 md:px-8 z-20 glass/50">
          <div className="flex items-center gap-4 lg:hidden mr-4">
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 glass rounded-xl text-app-fg/40 hover:text-app-fg"
             >
                <LayoutDashboard className="w-5 h-5" />
             </button>
             <Zap className="w-6 h-6 text-brand-gold" />
          </div>

          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-fg/20 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="text"
                placeholder="Search tasks, projects (Press Enter)..."
                className="w-full bg-app-fg/[0.02] border border-app-border rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-gold/30 transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 flex items-center justify-center text-app-fg/40 hover:text-app-fg transition-colors"
              >
                {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center text-app-fg/40 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <NotificationCenter />
            </div>
            
            <div className="h-8 w-px bg-app-border mx-2" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{currentUser.name}</p>
                <p className="text-[10px] text-app-fg/30 uppercase tracking-widest font-bold">{currentUser.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-app-border p-0.5 bg-brand-graphite overflow-hidden">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
