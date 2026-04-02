import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { Eye } from './Eye';

export function AIEyes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(window.innerWidth / 2);
  const mouseY = useRef(window.innerHeight / 2);

  // Motion values for eye pupil position (NO re-renders!)
  const leftEyeX = useMotionValue(0);
  const leftEyeY = useMotionValue(0);
  const rightEyeX = useMotionValue(0);
  const rightEyeY = useMotionValue(0);

  // Spring physics for smooth following
  const leftEyeXSpring = useSpring(leftEyeX, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  });
  const leftEyeYSpring = useSpring(leftEyeY, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  });
  const rightEyeXSpring = useSpring(rightEyeX, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
  });
  const rightEyeYSpring = useSpring(rightEyeY, {
    stiffness: 150,
    damping: 20,
    mass: 0.5,
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

  // Update eye pupil positions every frame (smooth 60fps)
  useAnimationFrame(() => {
    const centerX = window.innerWidth / 2;
    const leftEyePosX = centerX - eyeGap;
    const rightEyePosX = centerX + eyeGap;

    // Calculate offset from eye center to mouse (max 24px in each direction for natural look)
    const maxOffset = 24;

    // Left eye offset
    const leftDx = mouseX.current - leftEyePosX;
    const leftDy = mouseY.current - eyeY;
    const leftDistance = Math.sqrt(leftDx * leftDx + leftDy * leftDy);
    const leftOffsetX = leftDistance > 0 ? (leftDx / leftDistance) * Math.min(leftDistance / 20, maxOffset) : 0;
    const leftOffsetY = leftDistance > 0 ? (leftDy / leftDistance) * Math.min(leftDistance / 20, maxOffset) : 0;

    // Right eye offset
    const rightDx = mouseX.current - rightEyePosX;
    const rightDy = mouseY.current - eyeY;
    const rightDistance = Math.sqrt(rightDx * rightDx + rightDy * rightDy);
    const rightOffsetX = rightDistance > 0 ? (rightDx / rightDistance) * Math.min(rightDistance / 20, maxOffset) : 0;
    const rightOffsetY = rightDistance > 0 ? (rightDy / rightDistance) * Math.min(rightDistance / 20, maxOffset) : 0;

    // Update motion values (spring will smooth it)
    leftEyeX.set(leftOffsetX);
    leftEyeY.set(leftOffsetY);
    rightEyeX.set(rightOffsetX);
    rightEyeY.set(rightOffsetY);
  });

  return (
    <motion.div
      ref={containerRef}
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

      {/* Eyes - Cyan/Blue Iron Man style with proper pupil tracking */}
      <div className="relative pt-20">
        <div className="flex items-center justify-center gap-60">
          <Eye x={leftEyeXSpring} y={leftEyeYSpring} />
          <Eye x={rightEyeXSpring} y={rightEyeYSpring} />
        </div>

        {/* Connecting energy beam - cyan/blue */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-[3px] -z-10"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.5) 20%, rgba(14, 165, 233, 0.7) 50%, rgba(6, 182, 212, 0.5) 80%, transparent 100%)',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.7), 0 0 30px rgba(14, 165, 233, 0.4)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
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
