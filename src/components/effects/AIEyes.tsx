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
      <div className="relative flex gap-20">
        {/* Left Eye */}
        <div className="relative w-40 h-12 flex items-center justify-center">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-cyan-400/40 blur-3xl animate-pulse" />

          {/* Eye shape - wide oval slit */}
          <div
            className="relative w-36 h-10 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-2xl shadow-cyan-400 opacity-95 transition-transform duration-200 ease-out"
            style={{
              borderRadius: '50% / 100%',
              transform: `rotate(${calculateEyeRotation(
                containerRef.current
                  ? containerRef.current.getBoundingClientRect().left + 80
                  : 0,
                containerRef.current
                  ? containerRef.current.getBoundingClientRect().top + 24
                  : 0
              ) * 0.05}deg)`,
              filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.9)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.7))',
            }}
          >
            {/* Inner bright glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-70" style={{ borderRadius: '50% / 100%' }} />

            {/* Center bright line */}
            <div className="absolute inset-y-0 left-1/3 right-1/3 bg-cyan-100 opacity-80" style={{ borderRadius: '50% / 100%' }} />
          </div>

          {/* Scanning line effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-200/60 to-transparent h-4 animate-scan" />
          </div>
        </div>

        {/* Right Eye */}
        <div className="relative w-40 h-12 flex items-center justify-center">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-cyan-400/40 blur-3xl animate-pulse" />

          {/* Eye shape - wide oval slit */}
          <div
            className="relative w-36 h-10 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-2xl shadow-cyan-400 opacity-95 transition-transform duration-200 ease-out"
            style={{
              borderRadius: '50% / 100%',
              transform: `rotate(${calculateEyeRotation(
                containerRef.current
                  ? containerRef.current.getBoundingClientRect().left + 80 + 160 + 80 // 80 (half left) + 160 (left width) + 80 (gap-20) + 80 (half right)
                  : 0,
                containerRef.current
                  ? containerRef.current.getBoundingClientRect().top + 24
                  : 0
              ) * 0.05}deg)`,
              filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.9)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.7))',
            }}
          >
            {/* Inner bright glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-70" style={{ borderRadius: '50% / 100%' }} />

            {/* Center bright line */}
            <div className="absolute inset-y-0 left-1/3 right-1/3 bg-cyan-100 opacity-80" style={{ borderRadius: '50% / 100%' }} />
          </div>

          {/* Scanning line effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-200/60 to-transparent h-4 animate-scan" />
          </div>
        </div>
      </div>

      {/* Connecting light beam between eyes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

      {/* Subtle outer glow */}
      <div className="absolute -inset-16 bg-gradient-radial from-cyan-400/20 via-transparent to-transparent blur-3xl" />
    </div>
  );
}
