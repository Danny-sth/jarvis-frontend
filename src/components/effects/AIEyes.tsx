import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export function AIEyes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Cache eye positions (calculate once on mount)
  const leftEyePos = useRef({ x: 0, y: 0 });
  const rightEyePos = useRef({ x: 0, y: 0 });
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  // Cache eye positions after mount
  useEffect(() => {
    const updateEyePositions = () => {
      if (leftEyeRef.current) {
        const rect = leftEyeRef.current.getBoundingClientRect();
        leftEyePos.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      if (rightEyeRef.current) {
        const rect = rightEyeRef.current.getBoundingClientRect();
        rightEyePos.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
    };

    updateEyePositions();
    window.addEventListener('resize', updateEyePositions);
    return () => window.removeEventListener('resize', updateEyePositions);
  }, []);

  // Throttled mouse tracking with RAF
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      setMousePos({ x: e.clientX, y: e.clientY });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 500);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  // Calculate eye rotation (MORE RESPONSIVE - 0.35 instead of 0.05)
  const calculateEyeRotation = (eyeX: number, eyeY: number) => {
    const dx = mousePos.x - eyeX;
    const dy = mousePos.y - eyeY;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return angle * 0.35; // 🔥 7x more responsive than before (was 0.05)
  };

  return (
    <motion.div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[5] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 0.4 : 0 }} // Slightly more visible
      transition={{ duration: 1 }}
    >
      {/* Eyes container with 160px gap */}
      <div className="flex items-center gap-40">
        {/* Left Eye */}
        <div ref={leftEyeRef} className="relative">
          <motion.div
            className="w-16 h-4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rounded-full relative overflow-hidden shadow-2xl"
            style={{
              transform: `rotate(${calculateEyeRotation(leftEyePos.current.x, leftEyePos.current.y)}deg)`,
              filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 30px rgba(34, 211, 238, 0.5))',
            }}
            animate={{
              filter: [
                'drop-shadow(0 0 15px rgba(34, 211, 238, 0.8))',
                'drop-shadow(0 0 20px rgba(34, 211, 238, 1))',
                'drop-shadow(0 0 15px rgba(34, 211, 238, 0.8))',
              ],
            }}
            transition={{
              duration: 200, // Faster transition
              ease: [0.4, 0, 0.2, 1], // Custom easing
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />

            {/* Center bright line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white opacity-90 -translate-y-1/2" />

            {/* Scanning line animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-200 to-transparent opacity-30"
              animate={{ translateY: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>

        {/* Right Eye (identical) */}
        <div ref={rightEyeRef} className="relative">
          <motion.div
            className="w-16 h-4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rounded-full relative overflow-hidden shadow-2xl"
            style={{
              transform: `rotate(${calculateEyeRotation(rightEyePos.current.x, rightEyePos.current.y)}deg)`,
              filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 30px rgba(34, 211, 238, 0.5))',
            }}
            animate={{
              filter: [
                'drop-shadow(0 0 15px rgba(34, 211, 238, 0.8))',
                'drop-shadow(0 0 20px rgba(34, 211, 238, 1))',
                'drop-shadow(0 0 15px rgba(34, 211, 238, 0.8))',
              ],
            }}
            transition={{
              duration: 200,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />

            {/* Center bright line */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white opacity-90 -translate-y-1/2" />

            {/* Scanning line animation */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-200 to-transparent opacity-30"
              animate={{ translateY: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Connecting light beam between eyes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -z-10" />
    </motion.div>
  );
}
