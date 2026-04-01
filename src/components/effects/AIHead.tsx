import { motion } from 'framer-motion';

export function AIHead() {
  return (
    <motion.svg
      width="240"
      height="280"
      viewBox="0 0 240 280"
      className="absolute pointer-events-none opacity-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 2 }}
    >
      {/* Head silhouette - ellipse with subtle glow */}
      <defs>
        <radialGradient id="headGlow" cx="50%" cy="40%">
          <stop offset="0%" stopColor="rgba(220, 20, 60, 0.3)" />
          <stop offset="50%" stopColor="rgba(255, 69, 0, 0.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        <filter id="headBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
      </defs>

      {/* Background glow */}
      <ellipse
        cx="120"
        cy="140"
        rx="100"
        ry="130"
        fill="url(#headGlow)"
        filter="url(#headBlur)"
      />

      {/* Head outline (very subtle) */}
      <motion.ellipse
        cx="120"
        cy="140"
        rx="95"
        ry="125"
        fill="none"
        stroke="rgba(34, 211, 238, 0.15)"
        strokeWidth="1"
        animate={{
          strokeOpacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Breathing effect - inner glow pulse */}
      <motion.ellipse
        cx="120"
        cy="140"
        rx="80"
        ry="110"
        fill="rgba(34, 211, 238, 0.05)"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.svg>
  );
}
