import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'font-body font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
      primary: 'bg-jarvis-cyan text-jarvis-bg-dark hover:bg-jarvis-cyan/80',
      secondary: 'bg-jarvis-purple text-white hover:bg-jarvis-purple/80',
      danger: 'bg-jarvis-orange text-white hover:bg-jarvis-orange/80',
      ghost: 'bg-transparent text-jarvis-text-secondary hover:bg-jarvis-bg-card hover:text-jarvis-text-primary border border-jarvis-cyan/20',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
