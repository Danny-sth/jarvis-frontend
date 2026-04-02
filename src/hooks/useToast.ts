import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

/**
 * Facade hook for toast notifications
 * Provides clean abstraction over ToastStore
 */
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
}
