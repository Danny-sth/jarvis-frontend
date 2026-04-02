import { forwardRef, useEffect, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  showCount?: boolean;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      label,
      maxLength,
      showCount = false,
      autoResize = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Auto-resize logic
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';
        // Set height to scrollHeight
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    const currentLength = typeof value === 'string' ? value.length : 0;
    const showCounter = showCount && maxLength !== undefined;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-body font-medium text-jarvis-text-secondary mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            maxLength={maxLength}
            className={cn(
              'w-full px-4 py-2.5 rounded-lg',
              'bg-jarvis-bg-dark border',
              'font-body text-base text-jarvis-text-primary placeholder:text-jarvis-text-muted',
              'transition-colors resize-none',
              'focus:outline-none focus:ring-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-jarvis-orange focus:border-jarvis-orange focus:ring-jarvis-orange'
                : 'border-jarvis-cyan/20 focus:border-jarvis-cyan focus:ring-jarvis-cyan',
              autoResize ? 'overflow-hidden' : 'min-h-[100px]',
              showCounter && 'pb-8',
              className
            )}
            {...props}
          />

          {showCounter && (
            <div className="absolute bottom-2 right-2 text-xs font-mono text-jarvis-text-muted">
              {currentLength}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-jarvis-orange">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
