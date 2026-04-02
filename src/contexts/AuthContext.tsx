import { createContext } from 'react';
import { useAuthStore } from '../store/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  username: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthStore();

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}
