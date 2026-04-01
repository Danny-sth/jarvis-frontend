import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

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

function AnimatedNumber({ value }: { value: number }) {
  // Initialize spring with current value to prevent flicker
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (v) => v.toFixed(1));
  const [displayValue, setDisplayValue] = useState(value.toFixed(1));

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on('change', (v) => setDisplayValue(v));
    return () => unsubscribe();
  }, [value, spring, display]);

  return <span>{displayValue}%</span>;
}

export function AnimatedProgress({
  value,
  label,
  color = 'cyan',
  size = 'md',
  showGlow = true,
  animated = true,
}: AnimatedProgressProps) {
  const config = colorConfig[color];
  const heightClass = sizeConfig[size];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium ${config.text}`}>{label}</span>
        <span className={`text-sm font-mono ${config.text}`}>
          {animated ? <AnimatedNumber value={value} /> : `${value.toFixed(1)}%`}
        </span>
      </div>

      <div className={`relative w-full ${heightClass} rounded-full ${config.bg} ${config.border} border overflow-hidden backdrop-blur-sm`}>
        {/* Animated shimmer background */}
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

        {/* Main progress bar */}
        <motion.div
          className={`${heightClass} rounded-full bg-gradient-to-r ${config.gradient} relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20,
            mass: 1,
          }}
          style={showGlow ? {
            boxShadow: config.glow.replace('shadow-[', '').replace(']', ''),
          } : {}}
        >
          {/* Animated shine effect */}
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
        </motion.div>

        {/* Pulse effect at the edge */}
        {value > 0 && value < 100 && (
          <motion.div
            className={`absolute top-0 ${heightClass} w-1 rounded-full bg-white/80`}
            style={{ left: `calc(${Math.min(value, 100)}% - 2px)` }}
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
      </div>
    </div>
  );
}

// Circular progress variant
export function AnimatedCircularProgress({
  value,
  label,
  color = 'cyan',
  size = 80,
}: {
  value: number;
  label: string;
  color?: 'cyan' | 'purple' | 'orange' | 'green';
  size?: number;
}) {
  const showGlow = true;
  const config = colorConfig[color];
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Initialize spring with current value to prevent flicker
  const spring = useSpring(value, { stiffness: 100, damping: 30 });
  const strokeDashoffset = useTransform(
    spring,
    (v) => circumference - (v / 100) * circumference
  );

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

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
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            className={showGlow ? config.glow : ''}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color === 'cyan' ? '#22d3ee' : color === 'purple' ? '#a855f7' : color === 'orange' ? '#fb923c' : '#34d399'} />
              <stop offset="100%" stopColor={color === 'cyan' ? '#67e8f9' : color === 'purple' ? '#e879f9' : color === 'orange' ? '#fbbf24' : '#6ee7b7'} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-mono font-bold ${config.text}`}>
            <AnimatedNumber value={value} />
          </span>
        </div>

        {/* Glow effect */}
        {showGlow && (
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
              background: `radial-gradient(circle, ${color === 'cyan' ? 'rgba(34,211,238,0.5)' : color === 'purple' ? 'rgba(168,85,247,0.5)' : color === 'orange' ? 'rgba(251,146,60,0.5)' : 'rgba(52,211,153,0.5)'} 0%, transparent 70%)`,
            }}
          />
        )}
      </div>
      <span className={`text-xs font-medium ${config.text} uppercase tracking-wider`}>{label}</span>
    </div>
  );
}
