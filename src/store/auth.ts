import { create } from 'zustand';
import { AuthService } from '../lib/auth/AuthService';
import { apiFactory } from '../lib/api/base/APIFactory';

// Initialize AuthService with dependencies
const authService = new AuthService(
  apiFactory.getClients().auth,
  apiFactory.getTokenProvider()
);

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  username: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  userId: null,
  username: null,
  role: null,

  login: async (username: string, password: string) => {
    try {
      const authData = await authService.login(username, password);

      // Update state
      set({
        isAuthenticated: true,
        userId: authData.userId,
        username: authData.username,
        role: authData.role,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    authService.logout();

    // Update state
    set({
      isAuthenticated: false,
      userId: null,
      username: null,
      role: null,
    });
  },

  checkAuth: () => {
    const authData = authService.getAuthData();

    set({
      isAuthenticated: authData.isAuthenticated,
      isLoading: false,
      userId: authData.userId,
      username: authData.username,
      role: authData.role,
    });
  },
}));
