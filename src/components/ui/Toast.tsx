import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { cn } from '../../lib/utils';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
  error: 'bg-jarvis-orange/10 border-jarvis-orange/30 text-jarvis-orange',
  info: 'bg-jarvis-cyan/10 border-jarvis-cyan/30 text-jarvis-cyan',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
};

export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];

        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm',
              'animate-in slide-in-from-top-2 fade-in duration-300',
              styles[toast.type]
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />

            <p className="flex-1 text-sm font-body text-jarvis-text-primary">{toast.message}</p>

            <button
              onClick={() => remove(toast.id)}
              className="flex-shrink-0 text-jarvis-text-muted hover:text-jarvis-text-primary transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
