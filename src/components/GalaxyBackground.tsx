import React, { useEffect, useRef } from 'react';

interface GalaxyBackgroundProps {
  className?: string;
  intensity?: 'full' | 'subtle';
  children?: React.ReactNode;
}

export const GalaxyBackground: React.FC<GalaxyBackgroundProps> = ({
  className = '',
  intensity = 'full',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw stardust & constellations statically once on mount or resize
    // (Zero continuous CPU / requestAnimationFrame loop)
    const renderStaticStarfield = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const goldColors = [
        'rgba(255, 228, 160, ',
        'rgba(251, 210, 139, ',
        'rgba(254, 243, 199, ',
        'rgba(247, 170, 67, ',
        'rgba(255, 180, 200, ',
        'rgba(255, 255, 255, ',
      ];

      // Constellations
      const constellations = [
        { x: width * 0.15, y: height * 0.32, size: 2.2, connectedTo: 1 },
        { x: width * 0.22, y: height * 0.26, size: 2.5, connectedTo: 2 },
        { x: width * 0.28, y: height * 0.38, size: 2.0 },
        { x: width * 0.68, y: height * 0.22, size: 2.2, connectedTo: 4 },
        { x: width * 0.76, y: height * 0.28, size: 2.6, connectedTo: 5 },
        { x: width * 0.84, y: height * 0.36, size: 2.2 },
      ];

      // Draw faint constellation lines
      ctx.strokeStyle = 'rgba(255, 180, 210, 0.14)';
      ctx.lineWidth = 0.75;
      for (let i = 0; i < constellations.length; i++) {
        const star = constellations[i];
        if (star.connectedTo !== undefined && constellations[star.connectedTo]) {
          const target = constellations[star.connectedTo];
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }

      // Draw constellation nodes with soft aura
      for (let i = 0; i < constellations.length; i++) {
        const star = constellations[i];
        const radGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3.5);
        radGlow.addColorStop(0, 'rgba(255, 230, 180, 0.75)');
        radGlow.addColorStop(1, 'rgba(255, 200, 220, 0)');
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw stardust particles along diagonal stream
      const particleCount = intensity === 'full' ? 120 : 60;
      for (let i = 0; i < particleCount; i++) {
        const t = Math.random();
        const streamX = t * width;
        const streamY = height * 0.25 + Math.sin(t * Math.PI * 1.8) * height * 0.3 + t * height * 0.45;
        const spread = (Math.pow(Math.random(), 1.6) - 0.5) * (height * 0.45);
        const perpAngle = Math.atan2(height * 0.4, width) + Math.PI / 2;

        const x = (streamX + Math.cos(perpAngle) * spread + width) % width;
        const y = Math.max(0, Math.min(height, streamY + Math.sin(perpAngle) * spread));
        const color = goldColors[Math.floor(Math.random() * goldColors.length)];
        const alpha = Math.random() * 0.65 + 0.25;
        const isSparkle = Math.random() < 0.08;

        if (isSparkle) {
          const s = Math.random() * 2 + 1.5;
          ctx.fillStyle = `${color}${alpha})`;
          ctx.beginPath();
          ctx.moveTo(x, y - s * 2);
          ctx.quadraticCurveTo(x, y, x + s * 2, y);
          ctx.quadraticCurveTo(x, y, x, y + s * 2);
          ctx.quadraticCurveTo(x, y, x - s * 2, y);
          ctx.quadraticCurveTo(x, y, x, y - s * 2);
          ctx.fill();
        } else {
          const size = Math.random() * 1.2 + 0.4;
          ctx.fillStyle = `${color}${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    };

    renderStaticStarfield();

    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(renderStaticStarfield, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [intensity]);

  return (
    <div className={`relative min-h-screen bg-[#140207] ${className}`}>
      {/* High-Performance Fixed Background (Viewport-pinned, 0% CPU overhead, no lag) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep Crimson Cosmic Base Gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, #380715 0%, #22030c 50%, #120106 100%)',
          }}
        />

        {/* Static Glowing Nebula Highlights (Static GPU-rasterized layers, no continuous float animation) */}
        <div 
          className="absolute -top-[10%] right-[8%] w-[520px] h-[420px] rounded-full pointer-events-none blur-[70px] opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(228, 65, 118, 0.35) 0%, rgba(180, 30, 80, 0.15) 50%, transparent 70%)',
          }}
        />
        <div 
          className="absolute top-[35%] -left-[8%] w-[480px] h-[380px] rounded-full pointer-events-none blur-[75px] opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(214, 51, 108, 0.3) 0%, rgba(150, 20, 65, 0.12) 50%, transparent 75%)',
          }}
        />
        <div 
          className="absolute bottom-[8%] right-[18%] w-[420px] h-[320px] rounded-full pointer-events-none blur-[65px] opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(255, 110, 160, 0.25) 0%, rgba(170, 30, 75, 0.12) 50%, transparent 70%)',
          }}
        />

        {/* Delicate Silk Flow Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15" preserveAspectRatio="none" viewBox="0 0 1440 900">
          <path 
            d="M-100,300 C300,150 600,450 1000,280 C1300,120 1500,250 1600,200 L1600,900 L-100,900 Z" 
            fill="url(#silk-gradient-1)"
          />
          <path 
            d="M-50,600 C400,450 700,750 1100,500 C1350,320 1500,450 1600,400 L1600,900 L-50,900 Z" 
            fill="url(#silk-gradient-2)"
          />
          <defs>
            <linearGradient id="silk-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA4C0" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#E53965" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#7E1730" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="silk-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD285" stopOpacity="0.08" />
              <stop offset="60%" stopColor="#D82A58" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#3B0512" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Static Crisp Stardust Canvas (Zero CPU in idle/scroll) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none w-full h-full"
        />
      </div>

      {/* Content wrapper - natural overflow allowing sticky header/sidebar to track perfectly */}
      {children && (
        <div className="relative z-10 w-full flex-1 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
