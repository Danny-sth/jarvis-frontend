import { motion, type MotionValue } from 'framer-motion';

interface EyeProps {
  rotation: MotionValue<number>;
  className?: string;
}

/**
 * Reusable Iron Man-style eye component
 * Extracted to eliminate code duplication in AIEyes and AnimatedProgress
 */
export function Eye({ rotation, className = 'w-28 h-7' }: EyeProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        rotate: rotation,
      }}
    >
      {/* Eye outer glow - red */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.9) 0%, rgba(220, 38, 38, 0.3) 50%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Eye main body - red to yellow gradient */}
      <div
        className="absolute inset-0 rounded-full relative overflow-hidden"
        style={{
          background:
            'linear-gradient(90deg, rgba(220, 38, 38, 1) 0%, rgba(234, 179, 8, 1) 50%, rgba(220, 38, 38, 1) 100%)',
          boxShadow:
            '0 0 25px rgba(220, 38, 38, 0.9), 0 0 50px rgba(220, 38, 38, 0.5), inset 0 0 15px rgba(234, 179, 8, 0.7)',
        }}
      >
        {/* Inner white hot spot */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-75" />

        {/* Center bright line */}
        <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white opacity-95 -translate-y-1/2 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />

        {/* Scanning line animation - yellow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-300 to-transparent opacity-50"
          animate={{ translateY: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Edge highlights */}
        <div className="absolute inset-0 rounded-full border-2 border-white/20" />
      </div>

      {/* Pulsing animation overlay */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(234, 179, 8, 0.7) 0%, transparent 60%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
