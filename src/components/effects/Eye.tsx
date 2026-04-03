import { motion } from 'framer-motion';

interface EyeProps {
  className?: string;
}

/**
 * Iron Man helmet eye - narrow trapezoidal glowing slit
 * Classic MCU Iron Man style - no pupils, just bright glowing aperture
 */
export function Eye({ className = '' }: EyeProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer glow - SUPER bright blue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 100% at center, rgba(59, 130, 246, 1) 0%, rgba(96, 165, 250, 0.9) 30%, rgba(59, 130, 246, 0.7) 60%, transparent 80%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Main eye slit - trapezoidal shape */}
      <svg
        viewBox="0 0 120 30"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }}
      >
        <defs>
          {/* SUPER bright blue gradient - Iron Man style */}
          <linearGradient id="eyeGlow" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.9)" />
            <stop offset="15%" stopColor="rgba(96, 165, 250, 1)" />
            <stop offset="30%" stopColor="rgba(147, 197, 253, 1)" />
            <stop offset="50%" stopColor="rgba(191, 219, 254, 1)" />
            <stop offset="70%" stopColor="rgba(147, 197, 253, 1)" />
            <stop offset="85%" stopColor="rgba(96, 165, 250, 1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.9)" />
          </linearGradient>
        </defs>

        {/* Trapezoidal eye shape - wider in center, narrower at edges */}
        <polygon
          points="10,15 30,8 90,8 110,15 90,22 30,22"
          fill="url(#eyeGlow)"
          opacity="0.95"
        />
      </svg>

      {/* Inner SUPER bright core - blue with white center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 1) 15%, rgba(147, 197, 253, 1) 35%, rgba(255, 255, 255, 1) 50%, rgba(147, 197, 253, 1) 65%, rgba(96, 165, 250, 1) 85%, transparent 100%)',
          clipPath: 'polygon(8% 50%, 25% 20%, 75% 20%, 92% 50%, 75% 80%, 25% 80%)',
        }}
      />

      {/* Scanning line animation - blue */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(147, 197, 253, 0.7) 50%, transparent 100%)',
          clipPath: 'polygon(8% 50%, 25% 20%, 75% 20%, 92% 50%, 75% 80%, 25% 80%)',
        }}
        animate={{
          translateY: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Pulsing glow effect - blue */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 70% at center, rgba(96, 165, 250, 0.5) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
