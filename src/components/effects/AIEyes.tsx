import { useEffect, useRef, useState } from 'react';

export function AIEyes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show eyes after a short delay
    const timer = setTimeout(() => setIsVisible(true), 500);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const calculateEyeRotation = (eyeX: number, eyeY: number) => {
    if (!containerRef.current) return 0;

    const dx = mousePos.x - eyeX;
    const dy = mousePos.y - eyeY;
    const angle = Math.atan2(dy, dx);

    return (angle * 180) / Math.PI;
  };

  return (
    <div
      ref={containerRef}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex gap-16">
        {/* Left Eye */}
        <div className="relative w-28 h-16 flex items-center justify-center">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-cyan-400/40 blur-2xl rounded-full animate-pulse" />

          {/* Eye shape - oval */}
          <div
            className="relative w-24 h-12 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 rounded-full shadow-lg shadow-cyan-400 opacity-90 transition-transform duration-200 ease-out"
            style={{
              transform: `rotate(${calculateEyeRotation(
                containerRef.current
                  ? containerRef.current.getBoundingClientRect().left + 56
                  : 0,
                containerRef.current
                  ? containerRef.current.getBoundingClientRect().top + 32
                  : 0
              ) * 0.1}deg)`,
              filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))',
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-1 bg-gradient-to-r from-cyan-300 via-white to-cyan-300 rounded-full opacity-60" />

            {/* Highlight */}
            <div className="absolute top-2 left-1/4 w-8 h-3 bg-white rounded-full opacity-40 blur-sm" />
          </div>

          {/* Scanning line effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-200/60 to-transparent h-4 animate-scan" />
          </div>
        </div>

        {/* Right Eye */}
        <div className="relative w-28 h-16 flex items-center justify-center">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-cyan-400/40 blur-2xl rounded-full animate-pulse" />

          {/* Eye shape - oval */}
          <div
            className="relative w-24 h-12 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 rounded-full shadow-lg shadow-cyan-400 opacity-90 transition-transform duration-200 ease-out"
            style={{
              transform: `rotate(${calculateEyeRotation(
                containerRef.current
                  ? containerRef.current.getBoundingClientRect().left + 56 + 112 + 64 // 56 (half left) + 112 (left width) + 64 (gap) + 56 (half right)
                  : 0,
                containerRef.current
                  ? containerRef.current.getBoundingClientRect().top + 32
                  : 0
              ) * 0.1}deg)`,
              filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 20px rgba(6, 182, 212, 0.6))',
            }}
          >
            {/* Inner glow */}
            <div className="absolute inset-1 bg-gradient-to-r from-cyan-300 via-white to-cyan-300 rounded-full opacity-60" />

            {/* Highlight */}
            <div className="absolute top-2 left-1/4 w-8 h-3 bg-white rounded-full opacity-40 blur-sm" />
          </div>

          {/* Scanning line effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-200/60 to-transparent h-4 animate-scan" />
          </div>
        </div>
      </div>

      {/* Connecting light beam between eyes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

      {/* Subtle outer glow */}
      <div className="absolute -inset-12 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent rounded-full blur-3xl" />
    </div>
  );
}
