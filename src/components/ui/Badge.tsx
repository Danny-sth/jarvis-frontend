import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-body font-semibold rounded-full';

  const variantStyles = {
    success: 'bg-green-500/10 text-green-400 border border-green-500/30',
    error: 'bg-jarvis-orange/10 text-jarvis-orange border border-jarvis-orange/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    info: 'bg-jarvis-cyan/10 text-jarvis-cyan border border-jarvis-cyan/30',
    default: 'bg-jarvis-purple/10 text-jarvis-purple border border-jarvis-purple/30',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
