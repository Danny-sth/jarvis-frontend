import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-body font-medium text-jarvis-text-secondary mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 bg-jarvis-bg-surface border rounded-lg font-body',
            'text-jarvis-text-primary placeholder:text-jarvis-text-muted',
            'border-jarvis-cyan/20 focus:border-jarvis-cyan focus:outline-none focus:ring-1 focus:ring-jarvis-cyan',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-jarvis-orange focus:border-jarvis-orange focus:ring-jarvis-orange',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-jarvis-orange font-body">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
