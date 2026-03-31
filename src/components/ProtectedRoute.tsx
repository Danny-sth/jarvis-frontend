import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  // Wait for auth check to complete
  if (isLoading) {
    return (
      <div className="min-h-screen bg-jarvis-bg-dark flex items-center justify-center">
        <div className="text-jarvis-cyan font-display text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, save attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
