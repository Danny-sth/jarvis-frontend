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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative flex gap-12">
        {/* Left Eye */}
        <div className="relative w-20 h-20">
          {/* Eye outer glow */}
          <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-2xl animate-pulse" />

          {/* Eye socket */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-cyan-400/30 rounded-full border-2 border-blue-400/50 shadow-lg shadow-blue-400/50">
            {/* Inner eye */}
            <div className="absolute inset-4 bg-gradient-to-br from-black to-jarvis-bg-dark rounded-full border border-cyan-400/40">
              {/* Iris */}
              <div className="absolute inset-3 bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-500 rounded-full opacity-70 animate-glow-pulse">
                {/* Iris details - rings */}
                <div className="absolute inset-2 border border-cyan-300/40 rounded-full" />
                <div className="absolute inset-4 border border-blue-300/50 rounded-full" />
              </div>

              {/* Pupil (moves with mouse) */}
              <div
                className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"
                style={{
                  transform: `translate(calc(-50% + ${calculatePupilPosition(
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().left + 40 // center of left eye (half of 80px)
                      : 0,
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().top + 40 // center of left eye
                      : 0
                  ).x}px), calc(-50% + ${calculatePupilPosition(
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().left + 40
                      : 0,
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().top + 40
                      : 0
                  ).y}px))`,
                }}
              >
                <div className="w-full h-full bg-black rounded-full border border-blue-400 shadow-lg shadow-cyan-400">
                  {/* Pupil highlight */}
                  <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-300 rounded-full opacity-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Scanning lines effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent h-5 animate-scan" />
          </div>
        </div>

        {/* Right Eye */}
        <div className="relative w-20 h-20">
          {/* Eye outer glow */}
          <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-2xl animate-pulse" />

          {/* Eye socket */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 to-cyan-400/30 rounded-full border-2 border-blue-400/50 shadow-lg shadow-blue-400/50">
            {/* Inner eye */}
            <div className="absolute inset-4 bg-gradient-to-br from-black to-jarvis-bg-dark rounded-full border border-cyan-400/40">
              {/* Iris */}
              <div className="absolute inset-3 bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-500 rounded-full opacity-70 animate-glow-pulse">
                {/* Iris details - rings */}
                <div className="absolute inset-2 border border-cyan-300/40 rounded-full" />
                <div className="absolute inset-4 border border-blue-300/50 rounded-full" />
              </div>

              {/* Pupil (moves with mouse) */}
              <div
                className="absolute top-1/2 left-1/2 w-6 h-6 -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 ease-out"
                style={{
                  transform: `translate(calc(-50% + ${calculatePupilPosition(
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().left + 40 + 80 + 48 + 40 // 40 (half left) + 80 (left width) + 48 (gap-12) + 40 (half right) = 208
                      : 0,
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().top + 40 // center of right eye
                      : 0
                  ).x}px), calc(-50% + ${calculatePupilPosition(
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().left + 40 + 80 + 48 + 40
                      : 0,
                    containerRef.current
                      ? containerRef.current.getBoundingClientRect().top + 40
                      : 0
                  ).y}px))`,
                }}
              >
                <div className="w-full h-full bg-black rounded-full border border-blue-400 shadow-lg shadow-cyan-400">
                  {/* Pupil highlight */}
                  <div className="absolute top-1 right-1 w-2 h-2 bg-cyan-300 rounded-full opacity-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Scanning lines effect */}
          <div className="absolute inset-0 overflow-hidden rounded-full opacity-30">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent h-5 animate-scan" />
          </div>
        </div>
      </div>

      {/* Connecting light beam between eyes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />

      {/* Subtle outer glow around entire face area */}
      <div className="absolute -inset-8 bg-gradient-radial from-blue-400/15 via-transparent to-transparent rounded-full blur-2xl" />
    </div>
  );
}
