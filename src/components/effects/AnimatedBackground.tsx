import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cyberpunk color palette
    const colors = {
      cyan: '#00ffff',
      magenta: '#ff00ff',
      orange: '#ff6600',
      red: '#ff0040',
      yellow: '#ffff00',
    };

    // Hexagonal grid parameters
    const hexSize = 30;
    const hexHeight = hexSize * Math.sqrt(3);

    // Data streams (vertical flowing lines)
    interface DataStream {
      x: number;
      chars: { y: number; char: string; opacity: number; speed: number }[];
      color: string;
    }

    const streams: DataStream[] = [];
    const streamCount = Math.floor(canvas.width / 40);

    for (let i = 0; i < streamCount; i++) {
      const streamColors = [colors.cyan, colors.magenta, colors.orange];
      streams.push({
        x: Math.random() * canvas.width,
        chars: Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, idx) => ({
          y: Math.random() * canvas.height,
          char: String.fromCharCode(0x30A0 + Math.random() * 96), // Katakana
          opacity: 1 - idx * 0.06,
          speed: Math.random() * 2 + 1,
        })),
        color: streamColors[Math.floor(Math.random() * streamColors.length)],
      });
    }

    // Glitch lines
    interface GlitchLine {
      y: number;
      width: number;
      height: number;
      duration: number;
      timer: number;
    }
    let glitchLines: GlitchLine[] = [];

    // Circuit nodes
    interface CircuitNode {
      x: number;
      y: number;
      connections: number[];
      pulse: number;
      pulseSpeed: number;
    }

    const nodes: CircuitNode[] = [];
    const nodeCount = 20;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: [],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // Connect nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 200 && node.connections.length < 3) {
            node.connections.push(j);
          }
        }
      });
    });

    let frame = 0;

    const drawHexGrid = () => {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      for (let row = -1; row < canvas.height / hexHeight + 1; row++) {
        for (let col = -1; col < canvas.width / (hexSize * 1.5) + 1; col++) {
          const x = col * hexSize * 1.5;
          const y = row * hexHeight + (col % 2 ? hexHeight / 2 : 0);

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + Math.PI / 6;
            const hx = x + hexSize * Math.cos(angle);
            const hy = y + hexSize * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
    };

    const drawDataStreams = () => {
      ctx.font = '14px monospace';

      streams.forEach((stream) => {
        stream.chars.forEach((char, idx) => {
          const alpha = char.opacity * 0.6;
          ctx.fillStyle =
            idx === 0
              ? stream.color
              : stream.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');

          if (idx === 0) {
            ctx.shadowColor = stream.color;
            ctx.shadowBlur = 10;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char.char, stream.x, char.y);

          char.y += char.speed;
          if (char.y > canvas.height) {
            char.y = -20;
            char.char = String.fromCharCode(0x30A0 + Math.random() * 96);
          }
        });
        ctx.shadowBlur = 0;
      });
    };

    const drawCircuitNetwork = () => {
      // Draw connections
      ctx.lineWidth = 1;

      nodes.forEach((node) => {
        const pulseIntensity = (Math.sin(node.pulse) + 1) / 2;

        node.connections.forEach((connIdx) => {
          const other = nodes[connIdx];
          const gradient = ctx.createLinearGradient(node.x, node.y, other.x, other.y);
          gradient.addColorStop(0, `rgba(255, 0, 255, ${0.1 + pulseIntensity * 0.2})`);
          gradient.addColorStop(1, `rgba(0, 255, 255, ${0.1 + pulseIntensity * 0.2})`);

          ctx.strokeStyle = gradient;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        });

        node.pulse += node.pulseSpeed;
      });

      // Draw nodes
      nodes.forEach((node) => {
        const pulseIntensity = (Math.sin(node.pulse) + 1) / 2;
        const size = 3 + pulseIntensity * 2;

        ctx.fillStyle = `rgba(255, 0, 255, ${0.5 + pulseIntensity * 0.5})`;
        ctx.shadowColor = colors.magenta;
        ctx.shadowBlur = 10 + pulseIntensity * 10;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const drawGlitchEffect = () => {
      // Randomly spawn glitch lines
      if (Math.random() < 0.02) {
        glitchLines.push({
          y: Math.random() * canvas.height,
          width: canvas.width,
          height: Math.random() * 5 + 2,
          duration: Math.random() * 10 + 5,
          timer: 0,
        });
      }

      glitchLines = glitchLines.filter((line) => {
        line.timer++;
        if (line.timer > line.duration) return false;

        const glitchColors = [colors.cyan, colors.magenta, colors.red];
        ctx.fillStyle = glitchColors[Math.floor(Math.random() * glitchColors.length)];
        ctx.globalAlpha = 0.1;
        ctx.fillRect(Math.random() * 50, line.y, line.width, line.height);
        ctx.globalAlpha = 1;

        return true;
      });
    };

    const drawScanLine = () => {
      const scanY = (frame * 2) % canvas.height;

      const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 10);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 50, canvas.width, 60);

      // Bright scan line
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawHexGrid();
      drawCircuitNetwork();
      drawDataStreams();
      drawGlitchEffect();
      drawScanLine();

      frame++;
      requestAnimationFrame(animate);
    };

    // Initial clear
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  );
}
