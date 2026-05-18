import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  workload: 'low' | 'optimal' | 'high' | 'critical';
  adminId?: string;
  onboardingCompleted?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeIds: string[];
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
  startDate: string;
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
  registerAdmin: (user: User) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  logout: () => void;
  completeOnboarding: (userId: string) => void;
  saveToStorage: () => void;
  getFromStorage: (key: string) => any;
  updateStorage: (key: string, value: any) => void;
}

const mockUsers: User[] = [
  { id: 'admin-khushbu', name: 'Khushbu Yadav', email: 'khushbu@admin.com', password: 'admin', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khushbu', status: 'online', workload: 'low' },
];

const mockProjects: Project[] = [];

const mockTasks: Task[] = [];

const updateProjectProgress = (state: AppState, projectId: string) => {
  const projectTasks = state.tasks.filter(t => t.projectId === projectId);
  if (projectTasks.length === 0) return state.projects;
  const completedTasks = projectTasks.filter(t => t.status === 'done');
  const progress = Math.round((completedTasks.length / projectTasks.length) * 100);
  
  return state.projects.map(p => p.id === projectId ? { ...p, progress } : p);
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
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
      registerAdmin: (user) => set((state) => ({ users: [...state.users, user] })),
      addUser: (user) => {
        const newUser = { ...user, adminId: get().currentUser?.id };
        set((state) => ({ users: [...state.users, newUser] }));
      },
      updateUser: (userId, updates) => set((state) => ({
        users: state.users.map((u) => u.id === userId ? { ...u, ...updates } : u)
      })),
      deleteUser: (userId) => set((state) => ({
        users: state.users.filter((u) => u.id !== userId)
      })),
      addTask: (task) => set((state) => {
        const newTasks = [...state.tasks, task];
        const newState = { ...state, tasks: newTasks };
        return { 
          tasks: newTasks,
          projects: updateProjectProgress(newState, task.projectId)
        };
      }),
      updateTask: (taskId, updates) => set((state) => {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;
        const newTasks = state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t);
        const newState = { ...state, tasks: newTasks };
        return {
          tasks: newTasks,
          projects: updateProjectProgress(newState, task.projectId)
        };
      }),
      deleteTask: (taskId) => set((state) => {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;
        const newTasks = state.tasks.filter((t) => t.id !== taskId);
        const newState = { ...state, tasks: newTasks };
        return {
          tasks: newTasks,
          projects: updateProjectProgress(newState, task.projectId)
        };
      }),
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (projectId, updates) => set((state) => ({
        projects: state.projects.map((p) => p.id === projectId ? { ...p, ...updates } : p)
      })),
      deleteProject: (projectId) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        tasks: state.tasks.filter((t) => t.projectId !== projectId)
      })),
      setTheme: (theme) => set((state) => ({ settings: { ...state.settings, theme } })),
      logout: () => set({ currentUser: null }),
      completeOnboarding: (userId) => set((state) => ({
        users: state.users.map((u) => u.id === userId ? { ...u, onboardingCompleted: true } : u),
        currentUser: state.currentUser?.id === userId ? { ...state.currentUser, onboardingCompleted: true } : state.currentUser
      })),
      
      saveToStorage: () => {
        const state = get();
        localStorage.setItem('taskorbit-custom-sync', JSON.stringify({
           users: state.users,
           tasks: state.tasks,
           projects: state.projects,
           settings: state.settings
        }));
      },
      getFromStorage: (key: string) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      },
      updateStorage: (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }),
    {
      name: 'taskorbit-storage-v4',
    }
  )
);

