import { motion } from 'framer-motion';
import { Eye } from './Eye';

export function AIEyes() {
  return (
    <motion.div
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[5] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      {/* AI Helmet Silhouette - Cyan/Blue theme (Iron Man) */}
      <svg
        width="500"
        height="350"
        viewBox="0 0 500 350"
        className="absolute top-0 left-1/2 -translate-x-1/2"
      >
        <defs>
          {/* Cyan glow gradient */}
          <radialGradient id="cyanGlow" cx="50%" cy="35%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.5)" />
            <stop offset="50%" stopColor="rgba(14, 165, 233, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Blue accent gradient */}
          <radialGradient id="blueGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <filter id="helmetBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        {/* Background glow - cyan */}
        <ellipse
          cx="250"
          cy="140"
          rx="170"
          ry="190"
          fill="url(#cyanGlow)"
          filter="url(#helmetBlur)"
          opacity="0.6"
        />

        {/* Helmet outline - subtle cyan */}
        <motion.ellipse
          cx="250"
          cy="140"
          rx="160"
          ry="180"
          fill="none"
          stroke="rgba(6, 182, 212, 0.4)"
          strokeWidth="2"
          animate={{
            strokeOpacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Inner helmet detail - blue accents */}
        <motion.ellipse
          cx="250"
          cy="140"
          rx="135"
          ry="155"
          fill="url(#blueGlow)"
          opacity="0.2"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Visor slit - dark horizontal line */}
        <rect
          x="80"
          y="120"
          width="340"
          height="50"
          rx="25"
          fill="rgba(0, 0, 0, 0.4)"
          opacity="0.3"
        />

        {/* Side helmet details - left */}
        <motion.path
          d="M 90 120 Q 80 140 90 160"
          stroke="rgba(6, 182, 212, 0.3)"
          strokeWidth="3"
          fill="none"
          animate={{
            strokeOpacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Side helmet details - right */}
        <motion.path
          d="M 410 120 Q 420 140 410 160"
          stroke="rgba(6, 182, 212, 0.3)"
          strokeWidth="3"
          fill="none"
          animate={{
            strokeOpacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </svg>

      {/* Eyes - Iron Man style trapezoidal glowing slits - BIGGER AND BRIGHTER */}
      <div className="relative pt-20">
        <div className="flex items-center justify-center gap-48">
          <Eye className="w-52 h-14" />
          <Eye className="w-52 h-14" />
        </div>

        {/* Connecting energy beam - blue */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-[2px] -z-10"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.6) 20%, rgba(147, 197, 253, 0.9) 50%, rgba(96, 165, 250, 0.6) 80%, transparent 100%)',
            boxShadow: '0 0 12px rgba(96, 165, 250, 0.8), 0 0 24px rgba(59, 130, 246, 0.6)',
          }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  );
}
