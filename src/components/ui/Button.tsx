import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, glow = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'font-display font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

    const variantClasses = {
      primary: `bg-gradient-to-r from-jarvis-red to-jarvis-orange text-white hover:from-jarvis-orange hover:to-jarvis-gold focus:ring-jarvis-red ${glow ? 'shadow-lg shadow-jarvis-red/50' : ''}`,
      secondary: 'bg-jarvis-bg-surface border border-jarvis-red/40 text-jarvis-text-primary hover:bg-jarvis-bg-card hover:border-jarvis-orange/60',
      ghost: 'text-jarvis-text-secondary hover:text-jarvis-red hover:bg-jarvis-bg-card',
      danger: `bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 focus:ring-red-500 ${glow ? 'shadow-lg shadow-red-500/50' : ''}`,
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        <button
          ref={ref}
          className={cn(
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            className
          )}
          disabled={disabled || loading}
          {...props}
        >
          {/* Shimmer effect */}
          {glow && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          )}

          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {children}
          </span>
        </button>
      </motion.div>
    );
  }
);

Button.displayName = 'Button';
