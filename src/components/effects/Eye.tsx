import { motion, type MotionValue } from 'framer-motion';

interface EyeProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  className?: string;
}

/**
 * Iron Man-style eye component with proper pupil tracking
 * Eyes don't rotate - the iris/pupil moves inside the eye socket
 */
export function Eye({ x, y, className = 'w-28 h-7' }: EyeProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Eye outer glow - cyan/blue (Iron Man colors) */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.8) 0%, rgba(14, 165, 233, 0.4) 50%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Eye socket/frame - darker blue outline */}
      <div
        className="absolute inset-0 rounded-full relative overflow-hidden"
        style={{
          background: 'rgba(8, 51, 68, 0.6)',
          boxShadow:
            '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(14, 165, 233, 0.3), inset 0 0 10px rgba(6, 182, 212, 0.4)',
          border: '2px solid rgba(6, 182, 212, 0.3)',
        }}
      >
        {/* Moving iris/pupil that tracks mouse */}
        <motion.div
          className="absolute w-16 h-6 rounded-full"
          style={{
            x,
            y,
            left: '50%',
            top: '50%',
            translateX: '-50%',
            translateY: '-50%',
            background:
              'radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 0%, rgba(6, 182, 212, 1) 30%, rgba(14, 165, 233, 1) 60%, rgba(6, 182, 212, 0.8) 100%)',
            boxShadow:
              '0 0 15px rgba(6, 182, 212, 1), 0 0 30px rgba(14, 165, 233, 0.8), inset 0 0 8px rgba(255, 255, 255, 0.9)',
          }}
        >
          {/* Center bright spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-[3px] bg-white opacity-95 shadow-[0_0_10px_rgba(255,255,255,1)]" />

          {/* Scanning line animation - cyan */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300 to-transparent opacity-40"
            animate={{ translateY: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Inner glow */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.4) 0%, transparent 60%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Outer pulsing glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.5) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
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
