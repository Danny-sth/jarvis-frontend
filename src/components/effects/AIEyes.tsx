import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { Eye } from './Eye';

export function AIEyes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(window.innerWidth / 2);
  const mouseY = useRef(window.innerHeight / 2);

  // Motion values for eye rotation (NO re-renders!)
  const leftEyeRotation = useMotionValue(0);
  const rightEyeRotation = useMotionValue(0);

  // Spring physics for smooth following
  const leftEyeSpring = useSpring(leftEyeRotation, {
    stiffness: 120,
    damping: 15,
    mass: 0.3,
  });
  const rightEyeSpring = useSpring(rightEyeRotation, {
    stiffness: 120,
    damping: 15,
    mass: 0.3,
  });

  // Eye positions (fixed at top center)
  const eyeGap = 120;
  const eyeY = 80;

  // Mouse tracking WITHOUT re-render
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update eye rotations every frame (smooth 60fps)
  useAnimationFrame(() => {
    const centerX = window.innerWidth / 2;
    const leftEyeX = centerX - eyeGap;
    const rightEyeX = centerX + eyeGap;

    // Calculate angles
    const leftDx = mouseX.current - leftEyeX;
    const leftDy = mouseY.current - eyeY;
    const leftAngle = Math.atan2(leftDy, leftDx) * (180 / Math.PI);

    const rightDx = mouseX.current - rightEyeX;
    const rightDy = mouseY.current - eyeY;
    const rightAngle = Math.atan2(rightDy, rightDx) * (180 / Math.PI);

    // Update motion values (spring will smooth it)
    leftEyeRotation.set(leftAngle);
    rightEyeRotation.set(rightAngle);
  });

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-[5] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    >
      {/* AI Helmet Silhouette - Red/Yellow/Black theme */}
      <svg
        width="500"
        height="350"
        viewBox="0 0 500 350"
        className="absolute top-0 left-1/2 -translate-x-1/2"
      >
        <defs>
          {/* Red glow gradient */}
          <radialGradient id="redGlow" cx="50%" cy="35%">
            <stop offset="0%" stopColor="rgba(220, 38, 38, 0.4)" />
            <stop offset="50%" stopColor="rgba(239, 68, 68, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Yellow accent gradient */}
          <radialGradient id="yellowGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(234, 179, 8, 0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <filter id="helmetBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
          </filter>
        </defs>

        {/* Background glow - red */}
        <ellipse
          cx="250"
          cy="140"
          rx="170"
          ry="190"
          fill="url(#redGlow)"
          filter="url(#helmetBlur)"
          opacity="0.7"
        />

        {/* Helmet outline - subtle red */}
        <motion.ellipse
          cx="250"
          cy="140"
          rx="160"
          ry="180"
          fill="none"
          stroke="rgba(220, 38, 38, 0.3)"
          strokeWidth="2"
          animate={{
            strokeOpacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Inner helmet detail - yellow accents */}
        <motion.ellipse
          cx="250"
          cy="140"
          rx="135"
          ry="155"
          fill="url(#yellowGlow)"
          opacity="0.2"
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.15, 0.25, 0.15],
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
          stroke="rgba(220, 38, 38, 0.2)"
          strokeWidth="3"
          fill="none"
          animate={{
            strokeOpacity: [0.1, 0.3, 0.1],
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
          stroke="rgba(220, 38, 38, 0.2)"
          strokeWidth="3"
          fill="none"
          animate={{
            strokeOpacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
      </svg>

      {/* Eyes - Red/Yellow with proper tracking */}
      <div className="relative pt-20">
        <div className="flex items-center justify-center gap-60">
          <Eye rotation={leftEyeSpring} />
          <Eye rotation={rightEyeSpring} />
        </div>

        {/* Connecting energy beam - red/yellow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-[3px] -z-10"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(220, 38, 38, 0.5) 20%, rgba(234, 179, 8, 0.6) 50%, rgba(220, 38, 38, 0.5) 80%, transparent 100%)',
            boxShadow: '0 0 15px rgba(220, 38, 38, 0.6)',
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
