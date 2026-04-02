import { motion, useSpring, useTransform } from 'framer-motion';
import { memo, useMemo } from 'react';

interface AnimatedProgressProps {
  value: number;
  label: string;
  color?: 'cyan' | 'purple' | 'orange' | 'green';
  size?: 'sm' | 'md' | 'lg';
  showGlow?: boolean;
  animated?: boolean;
}

const colorConfig = {
  cyan: {
    gradient: 'from-cyan-400 via-cyan-300 to-cyan-400',
    glow: 'shadow-[0_0_20px_rgba(34,211,238,0.6),0_0_40px_rgba(34,211,238,0.3)]',
    bg: 'bg-cyan-950/50',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
  purple: {
    gradient: 'from-purple-400 via-fuchsia-400 to-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.6),0_0_40px_rgba(168,85,247,0.3)]',
    bg: 'bg-purple-950/50',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  orange: {
    gradient: 'from-orange-400 via-amber-400 to-orange-400',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.6),0_0_40px_rgba(251,146,60,0.3)]',
    bg: 'bg-orange-950/50',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  green: {
    gradient: 'from-emerald-400 via-green-400 to-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.6),0_0_40px_rgba(52,211,153,0.3)]',
    bg: 'bg-emerald-950/50',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
};

const sizeConfig = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

type ColorConfig = typeof colorConfig[keyof typeof colorConfig];

// ✅ ИСПРАВЛЕНИЕ 1: AnimatedNumber с правильными паттернами
const AnimatedNumber = memo(({ value }: { value: number }) => {
  // Использовать useSpring напрямую - автоматически анимируется!
  const spring = useSpring(value, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const display = useTransform(spring, (v) => `${v.toFixed(1)}%`);

  return <motion.span>{display}</motion.span>;
}, (prev, next) => {
  // Оптимизация: re-render только если значение изменилось >= 0.1%
  return Math.abs(prev.value - next.value) < 0.1;
});

AnimatedNumber.displayName = 'AnimatedNumber';

// ✅ ИСПРАВЛЕНИЕ 3: Разделить статические компоненты
const ShimmerBackground = memo(() => (
  <motion.div
    className="absolute inset-0 opacity-20"
    style={{
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      backgroundSize: '200% 100%',
    }}
    animate={{
      backgroundPosition: ['200% 0%', '-200% 0%'],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
));

ShimmerBackground.displayName = 'ShimmerBackground';

const ShineEffect = memo(() => (
  <motion.div
    className="absolute inset-0"
    style={{
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      backgroundSize: '50% 100%',
    }}
    animate={{
      backgroundPosition: ['-100% 0%', '200% 0%'],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
      repeatDelay: 1,
    }}
  />
));

ShineEffect.displayName = 'ShineEffect';

const GlowEffect = memo(({ config }: { config: ColorConfig }) => (
  <motion.div
    className={`absolute inset-0 rounded-full opacity-0`}
    style={{
      boxShadow: config.glow.replace('shadow-[', '').replace(']', ''),
      filter: 'blur(8px)',
    }}
    animate={{
      opacity: [0, 0.6, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
));

GlowEffect.displayName = 'GlowEffect';

// ✅ ИСПРАВЛЕНИЕ 2: AnimatedProgress с мемоизацией
export const AnimatedProgress = memo(({
  value,
  label,
  color = 'cyan',
  size = 'md',
  showGlow = true,
  animated = true,
}: AnimatedProgressProps) => {
  const config = useMemo(() => colorConfig[color], [color]);
  const heightClass = sizeConfig[size];

  // Использовать useSpring для smooth width animation
  const springWidth = useSpring(value, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  const width = useTransform(springWidth, (v) => `${Math.min(v, 100)}%`);
  const pulseLeft = useTransform(springWidth, (v) => `calc(${Math.min(v, 100)}% - 2px)`);

  return (
    <div className="space-y-2">
      {/* Header - не зависит от value, не будет re-render */}
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${config.text}`}>{label}</span>
        <span className={`text-sm font-mono ${config.text}`}>
          {animated ? <AnimatedNumber value={value} /> : `${value.toFixed(1)}%`}
        </span>
      </div>

      <div className={`relative w-full ${heightClass} rounded-full ${config.bg} ${config.border} border overflow-hidden backdrop-blur-sm`}>
        {/* Shimmer - статическая анимация, не зависит от value */}
        <ShimmerBackground />

        {/* Main progress bar - использует motion value вместо prop */}
        <motion.div
          className={`${heightClass} rounded-full bg-gradient-to-r ${config.gradient} relative overflow-hidden`}
          style={{ width }}
        >
          {/* Shine effect - статическая */}
          <ShineEffect />
        </motion.div>

        {/* Pulse - использует motion value для position */}
        {value > 0 && value < 100 && (
          <motion.div
            className={`absolute top-0 ${heightClass} w-1 rounded-full bg-white/80`}
            style={{ left: pulseLeft }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Glow effect */}
        {showGlow && value > 0 && <GlowEffect config={config} />}
      </div>
    </div>
  );
}, (prev, next) => {
  // Мемоизация: re-render только если value значительно изменился
  return (
    prev.value === next.value &&
    prev.label === next.label &&
    prev.color === next.color &&
    prev.size === next.size
  );
});

AnimatedProgress.displayName = 'AnimatedProgress';

interface AnimatedCircularProgressProps {
  value: number;
  label: string;
  color?: 'cyan' | 'purple' | 'orange' | 'green';
  size?: number;
}

// ✅ Glow effect для circular progress - отдельный компонент
const GlowEffectCircular = memo(({ config, color }: { config: ColorConfig; color: string }) => {
  const colorMap: Record<string, string> = {
    cyan: 'rgba(34,211,238,0.5)',
    purple: 'rgba(168,85,247,0.5)',
    orange: 'rgba(251,146,60,0.5)',
    green: 'rgba(52,211,153,0.5)',
  };

  return (
    <motion.div
      className={`absolute inset-0 rounded-full blur-xl opacity-30 ${config.text}`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: `radial-gradient(circle, ${colorMap[color] || colorMap.cyan} 0%, transparent 70%)`,
      }}
    />
  );
});

GlowEffectCircular.displayName = 'GlowEffectCircular';

// ✅ AnimatedCircularProgress с теми же best practices
export const AnimatedCircularProgress = memo(({
  value,
  label,
  color = 'cyan',
  size = 80,
}: AnimatedCircularProgressProps) => {
  const showGlow = true;
  const config = colorConfig[color];
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // ✅ useSpring напрямую для value - автоматически анимируется!
  const spring = useSpring(value, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });

  // ✅ useTransform для вычисления strokeDashoffset
  const strokeDashoffset = useTransform(
    spring,
    (v) => circumference - (v / 100) * circumference
  );

  // Color mapping for gradients
  const colorStops: Record<string, { start: string; end: string }> = {
    cyan: { start: '#22d3ee', end: '#67e8f9' },
    purple: { start: '#a855f7', end: '#e879f9' },
    orange: { start: '#fb923c', end: '#fbbf24' },
    green: { start: '#34d399', end: '#6ee7b7' },
  };

  const colors = colorStops[color];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={`${config.text} opacity-20`}
          />
          {/* ✅ Animated circle использует motion value для strokeDashoffset */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#gradient-${color})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            className={showGlow ? config.glow : ''}
          />
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="100%" stopColor={colors.end} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text with AnimatedNumber */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-mono font-bold ${config.text}`}>
            <AnimatedNumber value={value} />
          </span>
        </div>

        {/* Glow effect - статическая анимация */}
        {showGlow && <GlowEffectCircular config={config} color={color} />}
      </div>
      <span className={`text-xs font-medium ${config.text} uppercase tracking-wider`}>
        {label}
      </span>
    </div>
  );
}, (prev, next) => {
  // Мемоизация: re-render только если значительно изменилось
  return (
    prev.value === next.value &&
    prev.label === next.label &&
    prev.color === next.color &&
    prev.size === next.size
  );
});

AnimatedCircularProgress.displayName = 'AnimatedCircularProgress';
