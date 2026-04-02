import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { APIProvider } from './contexts/APIContext';
import { AuthProvider } from './contexts/AuthContext';
import { MetricsProvider } from './contexts/MetricsContext';
import { ToastProvider } from './contexts/ToastContext';

// Lazy load all route components for code splitting
const LoginPage = lazy(() => import('./routes/LoginPage'));
const DocsLayout = lazy(() => import('./routes/DocsLayout'));
const DocsPage = lazy(() => import('./routes/DocsPage'));
const AdminLayout = lazy(() => import('./routes/AdminLayout'));

// Admin Pages - lazy loaded
const Dashboard = lazy(() => import('./routes/admin/Dashboard'));
const QueueMonitor = lazy(() => import('./routes/admin/QueueMonitor'));
const HeartbeatConfig = lazy(() => import('./routes/admin/HeartbeatConfig'));
const WorkflowEditor = lazy(() => import('./routes/admin/WorkflowEditor'));
const RecurringTasks = lazy(() => import('./routes/admin/RecurringTasks'));
const MemoryBrowser = lazy(() => import('./routes/admin/MemoryBrowser'));
const SystemHealth = lazy(() => import('./routes/admin/SystemHealth'));
const UserManagement = lazy(() => import('./routes/admin/UserManagement'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      refetchOnWindowFocus: false,
    },
  },
});

// Suspense wrapper for lazy-loaded routes
function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-jarvis-bg-dark">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

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
          <Route
            path="/login"
            element={
              <LazyRoute>
                <LoginPage />
              </LazyRoute>
            }
          />

          {/* Documentation (PUBLIC - no auth required) */}
          <Route
            path="/docs"
            element={
              <LazyRoute>
                <DocsLayout />
              </LazyRoute>
            }
          >
            <Route
              index
              element={
                <LazyRoute>
                  <DocsPage />
                </LazyRoute>
              }
            />
            <Route
              path=":page"
              element={
                <LazyRoute>
                  <DocsPage />
                </LazyRoute>
              }
            />
          </Route>

          {/* Admin Panel (PROTECTED) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <LazyRoute>
                  <AdminLayout />
                </LazyRoute>
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <LazyRoute>
                  <Dashboard />
                </LazyRoute>
              }
            />
            <Route
              path="queue"
              element={
                <LazyRoute>
                  <QueueMonitor />
                </LazyRoute>
              }
            />
            <Route
              path="heartbeat"
              element={
                <LazyRoute>
                  <HeartbeatConfig />
                </LazyRoute>
              }
            />
            <Route
              path="workflows"
              element={
                <LazyRoute>
                  <WorkflowEditor />
                </LazyRoute>
              }
            />
            <Route
              path="recurring"
              element={
                <LazyRoute>
                  <RecurringTasks />
                </LazyRoute>
              }
            />
            <Route
              path="memory"
              element={
                <LazyRoute>
                  <MemoryBrowser />
                </LazyRoute>
              }
            />
            <Route
              path="system"
              element={
                <LazyRoute>
                  <SystemHealth />
                </LazyRoute>
              }
            />
            <Route
              path="users"
              element={
                <LazyRoute>
                  <UserManagement />
                </LazyRoute>
              }
            />
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
