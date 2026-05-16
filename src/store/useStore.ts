import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  workload: 'low' | 'optimal' | 'high' | 'critical';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId: string;
  projectId: string;
  dueDate: string;
  createdAt: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  healthScore: number;
  managerId: string;
  teamIds: string[];
  deadline: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  tasks: Task[];
  projects: Project[];
  notifications: any[];
  messages: any[];
  settings: {
    theme: 'dark' | 'light';
    animationsEnabled: boolean;
  };
  
  setCurrentUser: (user: User | null) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

const mockUsers: User[] = [
  { id: '1', name: 'Alex Rivera', email: 'admin@taskorbit.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', status: 'online', workload: 'optimal' },
  { id: '2', name: 'Sarah Chen', email: 'member@taskorbit.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'online', workload: 'high' },
  { id: '3', name: 'Marcus Bell', email: 'marcus@taskorbit.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', status: 'busy', workload: 'low' },
  { id: '4', name: 'Elena Frost', email: 'elena@taskorbit.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', status: 'online', workload: 'critical' },
  { id: '5', name: 'David Kim', email: 'david@taskorbit.com', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', status: 'offline', workload: 'optimal' },
];

const mockProjects: Project[] = [
  { id: 'p1', name: 'Neural Nexus', description: 'Next-gen AI interface development', status: 'active', progress: 65, healthScore: 92, managerId: '1', teamIds: ['1', '2', '3'], deadline: '2024-06-15' },
  { id: 'p2', name: 'Quantum Sync', description: 'Distributed systems synchronization protocol', status: 'active', progress: 40, healthScore: 78, managerId: '1', teamIds: ['1', '4', '5'], deadline: '2024-07-20' },
  { id: 'p3', name: 'Aura UI', description: 'Cinematic component library', status: 'completed', progress: 100, healthScore: 95, managerId: '1', teamIds: ['2', '3'], deadline: '2024-05-10' },
];

const mockTasks: Task[] = [
  { id: 't1', title: 'Implement Orbit Engine', description: 'Create the core visualization for the landing page', status: 'in-progress', priority: 'critical', assigneeId: '2', projectId: 'p1', dueDate: '2024-05-20', createdAt: '2024-05-12', tags: ['Frontend', 'Animation'] },
  { id: 't2', title: 'AI Integration Layer', description: 'Mock the AI decision making logic', status: 'todo', priority: 'high', assigneeId: '1', projectId: 'p1', dueDate: '2024-05-25', createdAt: '2024-05-13', tags: ['Backend', 'AI'] },
  { id: 't3', title: 'Design System Polish', description: 'Finalize the glassmorphism parameters', status: 'done', priority: 'medium', assigneeId: '3', projectId: 'p3', dueDate: '2024-05-10', createdAt: '2024-05-01', tags: ['Design'] },
  { id: 't4', title: 'Workload Algorithm', description: 'Optimize the workload balancing logic', status: 'todo', priority: 'high', assigneeId: '4', projectId: 'p2', dueDate: '2024-06-01', createdAt: '2024-05-14', tags: ['Logic'] },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: mockUsers,
      tasks: mockTasks,
      projects: mockProjects,
      notifications: [],
      messages: [],
      settings: {
        theme: 'dark',
        animationsEnabled: true,
      },
      
      setCurrentUser: (user) => set({ currentUser: user }),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
      })),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId)
      })),
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (projectId, updates) => set((state) => ({
        projects: state.projects.map((p) => p.id === projectId ? { ...p, ...updates } : p)
      })),
      setTheme: (theme) => set((state) => ({ settings: { ...state.settings, theme } })),
    }),
    {
      name: 'taskorbit-storage',
    }
  )
);
