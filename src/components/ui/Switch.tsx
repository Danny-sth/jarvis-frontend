import { cn } from '../../lib/utils';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled = false }: SwitchProps) {
  return (
    <label className={cn('flex items-center gap-3', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-jarvis-cyan focus:ring-offset-2 focus:ring-offset-jarvis-bg-dark',
          checked ? 'bg-jarvis-cyan' : 'bg-jarvis-bg-dark border border-jarvis-cyan/20',
          disabled && 'cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>

      {label && (
        <span className="text-sm font-body text-jarvis-text-secondary select-none">{label}</span>
      )}
    </label>
  );
}
