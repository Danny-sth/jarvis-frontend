import { cn } from '../../lib/utils';

interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
}: SkeletonProps) {
  const baseStyles = 'bg-jarvis-cyan/10 animate-pulse';

  const variantStyles = {
    text: 'h-4 rounded',
    rect: 'rounded-lg',
    circle: 'rounded-full',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // Default heights for variants
  if (!height) {
    if (variant === 'text') {
      style.height = '1rem';
    } else if (variant === 'circle') {
      style.height = style.width || '48px';
    } else {
      style.height = '100px';
    }
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
}

// Convenience components for common patterns
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 bg-jarvis-bg-card border border-jarvis-cyan/20 rounded-lg', className)}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circle" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" width="60%" className="mb-2" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}
