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
import AdminDashboard from './pages/AdminDashboard';
import AdminTasksPage from './pages/AdminTasksPage';
import MessagesPage from './pages/MessagesPage';
import MemberDashboard from './pages/MemberDashboard';
import FocusMode from './pages/FocusMode';

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
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/tasks" element={
            <ProtectedRoute role="admin">
              <AdminTasksPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/projects" element={
            <ProtectedRoute role="admin">
              <div className="flex items-center justify-center h-[60vh] text-white/20 italic">Project Management Module Initializing...</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/tasks" element={
            <ProtectedRoute role="admin">
              <div className="flex items-center justify-center h-[60vh] text-white/20 italic">Task Control Center Initializing...</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/members" element={
            <ProtectedRoute role="admin">
              <div className="flex items-center justify-center h-[60vh] text-white/20 italic">Member Directory Synchronization...</div>
            </ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute role="admin">
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute role="admin">
              <div className="flex items-center justify-center h-[60vh] text-white/20 italic">Workspace Configuration Panel...</div>
            </ProtectedRoute>
          } />

          {/* Member Routes */}
          <Route path="/member" element={
            <ProtectedRoute role="member">
              <MemberDashboard />
            </ProtectedRoute>
          } />
          <Route path="/member/tasks" element={
            <ProtectedRoute role="member">
              <div className="flex items-center justify-center h-[60vh] text-white/20 italic">Personal Backlog Loading...</div>
            </ProtectedRoute>
          } />
          <Route path="/member/messages" element={
            <ProtectedRoute role="member">
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/member/settings" element={
            <ProtectedRoute role="member">
              <div className="flex items-center justify-center h-[60vh] text-white/20 italic">Personal Preferences...</div>
            </ProtectedRoute>
          } />
          
          {/* Full Screen Focus */}
          <Route path="/member/focus" element={<FocusMode />} />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

