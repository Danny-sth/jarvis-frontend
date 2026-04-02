import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Facade hook for authentication
 * Provides clean abstraction over AuthStore
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
