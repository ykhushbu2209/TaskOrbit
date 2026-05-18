/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useStore } from './store/useStore';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminTasksPage from './pages/AdminTasksPage';
import AdminMembersPage from './pages/AdminMembersPage';
import MessagesPage from './pages/MessagesPage';
import ProjectsPage from './pages/ProjectsPage';
import MemberDashboard from './pages/MemberDashboard';
import FocusModePage from './pages/FocusModePage';
import OrbitViewPage from './pages/OrbitViewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

// Components
import DashboardLayout from './components/DashboardLayout';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'member' }) => {
  const currentUser = useStore((state) => state.currentUser);
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/member'} replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute role="admin"><ProjectsPage /></ProtectedRoute>} />
          <Route path="/admin/tasks" element={<ProtectedRoute role="admin"><AdminTasksPage /></ProtectedRoute>} />
          <Route path="/admin/members" element={<ProtectedRoute role="admin"><AdminMembersPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute role="admin"><MessagesPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><SettingsPage /></ProtectedRoute>} />

          {/* Member Routes */}
          <Route path="/member" element={<ProtectedRoute role="member"><MemberDashboard /></ProtectedRoute>} />
          <Route path="/member/projects" element={<ProtectedRoute role="member"><ProjectsPage /></ProtectedRoute>} />
          <Route path="/member/tasks" element={<ProtectedRoute role="member"><AdminTasksPage /></ProtectedRoute>} />
          <Route path="/member/messages" element={<ProtectedRoute role="member"><MessagesPage /></ProtectedRoute>} />
          <Route path="/member/settings" element={<ProtectedRoute role="member"><SettingsPage /></ProtectedRoute>} />
          
          {/* Shared Immersive Routes */}
          <Route path="/admin/orbit" element={<ProtectedRoute role="admin"><OrbitViewPage /></ProtectedRoute>} />
          <Route path="/member/orbit" element={<ProtectedRoute role="member"><OrbitViewPage /></ProtectedRoute>} />
          <Route path="/focus" element={<ProtectedRoute><FocusModePage /></ProtectedRoute>} />

          {/* Simple Redirects for direct path access */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksRedirect /></ProtectedRoute>} />
          <Route path="/orbit" element={<ProtectedRoute><OrbitRedirect /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsRedirect /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

// Redirect Components
const DashboardRedirect = () => {
    const role = useStore(state => state.currentUser?.role);
    return <Navigate to={role === 'admin' ? '/admin' : '/member'} replace />;
};

const TasksRedirect = () => {
    const role = useStore(state => state.currentUser?.role);
    return <Navigate to={role === 'admin' ? '/admin/tasks' : '/member/tasks'} replace />;
};

const OrbitRedirect = () => {
    const role = useStore(state => state.currentUser?.role);
    return <Navigate to={role === 'admin' ? '/admin/orbit' : '/member/orbit'} replace />;
};

const SettingsRedirect = () => {
    const role = useStore(state => state.currentUser?.role);
    return <Navigate to={role === 'admin' ? '/admin/settings' : '/member/settings'} replace />;
};

