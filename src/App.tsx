import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Layouts
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedLayout from './layouts/ProtectedLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import TaskFormPage from './pages/TaskFormPage';
import TaskDetailPage from './pages/TaskDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const RouteChangeTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    logEvent(analytics, 'page_view', { page_path: location.pathname });
  }, [location]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <RouteChangeTracker />
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedLayout />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/tasks/new" element={<TaskFormPage />} />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />
                <Route path="/tasks/:id/edit" element={<TaskFormPage />} />

                {/* Provider-only route */}
                <Route element={<ProtectedLayout allowedRoles={['provider']} />}>
                  <Route path="/analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Additional pages (placeholder routes) */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/clients" element={<div className="p-4">Clients page (coming soon)</div>} />
                <Route path="/messages" element={<div className="p-4">Messages page (coming soon)</div>} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<div className="p-4">Help page (coming soon)</div>} />
              </Route>
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
