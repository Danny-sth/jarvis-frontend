import { useEffect, useRef, useState } from 'react';

export function AIEyes() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show eyes after a short delay for dramatic effect
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

  const calculatePupilPosition = (eyeX: number, eyeY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const dx = mousePos.x - eyeX;
    const dy = mousePos.y - eyeY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 20, 12); // Max movement 12px

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  };

  return (
    <div
      ref={containerRef}
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-0 pointer-events-none transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex gap-24">
        {/* Left Eye */}
        <div className="relative w-32 h-32">
          {/* Eye outer glow */}
          <div className="absolute inset-0 bg-jarvis-red/20 rounded-full blur-2xl animate-pulse" />

          {/* Eye socket */}
          <div className="absolute inset-0 bg-gradient-to-br from-jarvis-red/30 to-jarvis-orange/20 rounded-full border-2 border-jarvis-red/40 shadow-lg shadow-jarvis-red/50">
            {/* Inner eye */}
            <div className="absolute inset-4 bg-gradient-to-br from-black to-jarvis-bg-dark rounded-full border border-jarvis-orange/30">
              {/* Iris */}
              <div className="absolute inset-3 bg-gradient-to-br from-jarvis-orange via-jarvis-red to-jarvis-gold rounded-full opacity-60 animate-glow-pulse">
                {/* Iris details - rings */}
                <div className="absolute inset-2 border border-jarvis-gold/30 rounded-full" />
                <div className="absolute inset-4 border border-jarvis-orange/40 rounded-full" />
              </div>

              {/* Pupil (moves with mouse) */}
              <div
                className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"
                style={{
                  transform: `translate(calc(-50% + ${calculatePupilPosition(
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().left + 64
                      : 0,
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().top + 64
                      : 0
                  ).x}px), calc(-50% + ${calculatePupilPosition(
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().left + 64
                      : 0,
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().top + 64
                      : 0
                  ).y}px))`,
                }}
              >
                <div className="w-full h-full bg-black rounded-full border-2 border-jarvis-red shadow-lg shadow-jarvis-red">
                  {/* Pupil highlight */}
                  <div className="absolute top-2 right-2 w-3 h-3 bg-jarvis-orange rounded-full opacity-80" />
                </div>
              </div>
            </div>
          </div>

          {/* Scanning lines effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jarvis-orange/40 to-transparent h-8 animate-scan" />
          </div>
        </div>

        {/* Right Eye */}
        <div className="relative w-32 h-32">
          {/* Eye outer glow */}
          <div className="absolute inset-0 bg-jarvis-red/20 rounded-full blur-2xl animate-pulse" />

          {/* Eye socket */}
          <div className="absolute inset-0 bg-gradient-to-br from-jarvis-red/30 to-jarvis-orange/20 rounded-full border-2 border-jarvis-red/40 shadow-lg shadow-jarvis-red/50">
            {/* Inner eye */}
            <div className="absolute inset-4 bg-gradient-to-br from-black to-jarvis-bg-dark rounded-full border border-jarvis-orange/30">
              {/* Iris */}
              <div className="absolute inset-3 bg-gradient-to-br from-jarvis-orange via-jarvis-red to-jarvis-gold rounded-full opacity-60 animate-glow-pulse">
                {/* Iris details - rings */}
                <div className="absolute inset-2 border border-jarvis-gold/30 rounded-full" />
                <div className="absolute inset-4 border border-jarvis-orange/40 rounded-full" />
              </div>

              {/* Pupil (moves with mouse) */}
              <div
                className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"
                style={{
                  transform: `translate(calc(-50% + ${calculatePupilPosition(
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().left + 64 + 192 // 64 (half eye) + 96 (gap) + 96 (gap) = offset to right eye
                      : 0,
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().top + 64
                      : 0
                  ).x}px), calc(-50% + ${calculatePupilPosition(
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().left + 64 + 192
                      : 0,
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().top + 64
                      : 0
                  ).y}px))`,
                }}
              >
                <div className="w-full h-full bg-black rounded-full border-2 border-jarvis-red shadow-lg shadow-jarvis-red">
                  {/* Pupil highlight */}
                  <div className="absolute top-2 right-2 w-3 h-3 bg-jarvis-orange rounded-full opacity-80" />
                </div>
              </div>
            </div>
          </div>

          {/* Scanning lines effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jarvis-orange/40 to-transparent h-8 animate-scan" />
          </div>
        </div>
      </div>

      {/* Connecting light beam between eyes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-jarvis-red to-transparent opacity-40" />

      {/* Subtle outer glow around entire face area */}
      <div className="absolute -inset-16 bg-gradient-radial from-jarvis-red/10 via-transparent to-transparent rounded-full blur-3xl" />
    </div>
  );
}
