/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react';
import { useToastStore } from '../store/toastStore';
import type { Toast } from '../store/toastStore';

export interface ToastContextValue {
  show: (toast: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }) => void;
  toasts: Toast[];
  remove: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastState = useToastStore();

  return (
    <ToastContext.Provider
      value={{
        show: toastState.show,
        toasts: toastState.toasts,
        remove: toastState.remove,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}
