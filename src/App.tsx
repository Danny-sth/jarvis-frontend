import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast';
import { APIProvider } from './contexts/APIContext';
import { AuthProvider } from './contexts/AuthContext';
import { MetricsProvider } from './contexts/MetricsContext';
import { ToastProvider } from './contexts/ToastContext';

// Pages
import LoginPage from './routes/LoginPage';
import DocsLayout from './routes/DocsLayout';
import DocsPage from './routes/DocsPage';
import AdminLayout from './routes/AdminLayout';

// Admin Pages
import Dashboard from './routes/admin/Dashboard';
import QueueMonitor from './routes/admin/QueueMonitor';
import HeartbeatConfig from './routes/admin/HeartbeatConfig';
import WorkflowEditor from './routes/admin/WorkflowEditor';
import RecurringTasks from './routes/admin/RecurringTasks';
import MemoryBrowser from './routes/admin/MemoryBrowser';
import SystemHealth from './routes/admin/SystemHealth';
import UserManagement from './routes/admin/UserManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { checkAuth, isAuthenticated } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Documentation (PUBLIC - no auth required) */}
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<DocsPage />} />
            <Route path=":page" element={<DocsPage />} />
          </Route>

          {/* Admin Panel (PROTECTED) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="queue" element={<QueueMonitor />} />
            <Route path="heartbeat" element={<HeartbeatConfig />} />
            <Route path="workflows" element={<WorkflowEditor />} />
            <Route path="recurring" element={<RecurringTasks />} />
            <Route path="memory" element={<MemoryBrowser />} />
            <Route path="system" element={<SystemHealth />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* Root - redirect based on auth state */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <APIProvider>
      <AuthProvider>
        <MetricsProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              <AppContent />
            </QueryClientProvider>
          </ToastProvider>
        </MetricsProvider>
      </AuthProvider>
    </APIProvider>
  );
}

export default App;
