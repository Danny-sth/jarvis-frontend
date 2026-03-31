import { create } from 'zustand';
import { api } from '../lib/api-client';

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
      const response = await api.login(username, password);

      // Save to localStorage
      localStorage.setItem('jarvis_token', response.token);
      localStorage.setItem('jarvis_user_id', response.user_id.toString());
      localStorage.setItem('jarvis_username', username);
      localStorage.setItem('jarvis_role', response.role);

      // Update API client with token
      api.setToken(response.token);

      // Update state
      set({
        isAuthenticated: true,
        userId: response.user_id.toString(),
        username: username,
        role: response.role,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem('jarvis_token');
    localStorage.removeItem('jarvis_user_id');
    localStorage.removeItem('jarvis_username');
    localStorage.removeItem('jarvis_role');

    // Clear API client token
    api.setToken(null);

    // Update state
    set({
      isAuthenticated: false,
      userId: null,
      username: null,
      role: null,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('jarvis_token');
    const userId = localStorage.getItem('jarvis_user_id');
    const username = localStorage.getItem('jarvis_username');
    const role = localStorage.getItem('jarvis_role');

    if (token && userId && username) {
      api.setToken(token);
      set({
        isAuthenticated: true,
        isLoading: false,
        userId,
        username,
        role,
      });
    } else {
      set({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        username: null,
        role: null,
      });
    }
  },
}));
