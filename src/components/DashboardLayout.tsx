import React from 'react';
import { motion } from 'motion/react';
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
  ChevronLeft
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, setCurrentUser, settings, setTheme } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  if (!currentUser) return null;

  const adminLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Projects', icon: Briefcase, path: '/admin/projects' },
    { name: 'Tasks', icon: CheckCircle2, path: '/admin/tasks' },
    { name: 'Members', icon: Users, path: '/admin/members' },
    { name: 'Messages', icon: MessageSquare, path: '/admin/messages' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const memberLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/member' },
    { name: 'My Tasks', icon: CheckCircle2, path: '/member/tasks' },
    { name: 'Focus Mode', icon: Orbit, path: '/member/focus' },
    { name: 'Messages', icon: MessageSquare, path: '/member/messages' },
    { name: 'Settings', icon: Settings, path: '/member/settings' },
  ];

  const links = currentUser.role === 'admin' ? adminLinks : memberLinks;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        className="relative h-full glass border-r border-white/5 z-30 flex flex-col"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 min-w-10 glass-morphism rounded-xl flex items-center justify-center">
            <Orbit className="w-6 h-6 text-brand-purple" />
          </div>
          {!isSidebarCollapsed && (
            <span className="text-xl font-display font-bold tracking-tight">TaskOrbit</span>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className={cn("w-5 h-5", isActive ? "text-brand-purple" : "group-hover:text-brand-purple")} />
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium">{link.name}</span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-link"
                    className="absolute inset-0 border border-brand-purple/50 rounded-2xl"
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
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 z-20 glass/50">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-brand-purple transition-colors" />
              <input 
                type="text"
                placeholder="Search tasks, projects (Press Enter)..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-purple rounded-full border-2 border-brand-black" />
              </button>
            </div>
            
            <div className="h-8 w-px bg-white/5 mx-2" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{currentUser.name}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{currentUser.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-brand-purple/20 p-0.5 bg-brand-graphite overflow-hidden">
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
