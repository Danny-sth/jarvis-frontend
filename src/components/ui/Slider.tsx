import { cn } from '../../lib/utils';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label?: string;
  showValue?: boolean;
  step?: number;
  disabled?: boolean;
}

export function Slider({
  value,
  onChange,
  min,
  max,
  label,
  showValue = true,
  step = 1,
  disabled = false,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('w-full', disabled && 'opacity-50')}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label className="text-sm font-body font-medium text-jarvis-text-secondary">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-mono text-jarvis-cyan font-semibold">{value}</span>
          )}
        </div>
      )}

      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-jarvis-bg-dark border border-jarvis-cyan/20 rounded-full">
          {/* Fill */}
          <div
            className="h-full bg-jarvis-cyan rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className={cn(
            'absolute inset-0 w-full h-2 opacity-0 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
          style={{
            // Custom thumb styling via appearance
            appearance: 'none',
            WebkitAppearance: 'none',
          }}
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-4 h-4 bg-jarvis-cyan border-2 border-jarvis-bg-dark rounded-full shadow-lg" />
        </div>
      </div>

      {/* Min/Max labels */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs font-mono text-jarvis-text-muted">{min}</span>
        <span className="text-xs font-mono text-jarvis-text-muted">{max}</span>
      </div>
    </div>
  );
}
