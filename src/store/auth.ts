import { create } from 'zustand';
import { api } from '../lib/api-client';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  username: null,

  login: async (username: string, password: string) => {
    try {
      await api.login(username, password);
      localStorage.setItem('jarvis_username', username);
      localStorage.setItem('jarvis_user_id', username); // Assuming user_id = username for now
      set({
        isAuthenticated: true,
        userId: username,
        username: username,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    api.logout();
    localStorage.removeItem('jarvis_username');
    localStorage.removeItem('jarvis_user_id');
    set({
      isAuthenticated: false,
      userId: null,
      username: null,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('jarvis_token');
    const username = localStorage.getItem('jarvis_username');
    const userId = localStorage.getItem('jarvis_user_id');

    if (token && username && userId) {
      set({
        isAuthenticated: true,
        userId,
        username,
      });
    } else {
      set({
        isAuthenticated: false,
        userId: null,
        username: null,
      });
    }
  },
}));
