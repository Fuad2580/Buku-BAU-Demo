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

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Stardust particles following cosmic galaxy streams
    interface StarParticle {
      x: number;
      y: number;
      size: number;
      color: string;
      baseAlpha: number;
      twinkleSpeed: number;
      phase: number;
      isSparkle: boolean;
      driftSpeedX: number;
      driftSpeedY: number;
    }

    let particles: StarParticle[] = [];

    // Constellation points
    interface ConstellationStar {
      x: number;
      y: number;
      size: number;
      connectedTo?: number;
    }
    let constellations: ConstellationStar[] = [];

    const goldColors = [
      'rgba(255, 228, 160, ',
      'rgba(251, 210, 139, ',
      'rgba(254, 243, 199, ',
      'rgba(247, 170, 67, ',
      'rgba(255, 180, 200, ',
      'rgba(255, 255, 255, ',
    ];

    const initParticles = () => {
      particles = [];
      const particleCount = intensity === 'full' ? Math.min(280, Math.floor((width * height) / 3800)) : 120;

      // Cosmic dust curved band path (from left to right diagonal flow)
      for (let i = 0; i < particleCount; i++) {
        // Curve along t from 0 to 1
        const t = Math.random();
        
        // S-curve / diagonal arch through the screen
        const streamX = t * width;
        const streamY = height * 0.25 + Math.sin(t * Math.PI * 1.8) * height * 0.35 + t * height * 0.45;
        
        // Scatter around stream with dense core and diffuse aura
        const spread = (Math.pow(Math.random(), 1.8) - 0.5) * (height * 0.45);
        const perpAngle = Math.atan2(height * 0.4, width) + Math.PI / 2;

        const x = (streamX + Math.cos(perpAngle) * spread + width) % width;
        const y = Math.max(0, Math.min(height, streamY + Math.sin(perpAngle) * spread));

        const isSparkle = Math.random() < 0.08;
        const color = goldColors[Math.floor(Math.random() * goldColors.length)];

        particles.push({
          x,
          y,
          size: isSparkle ? Math.random() * 2.5 + 1.5 : Math.random() * 1.4 + 0.4,
          color,
          baseAlpha: Math.random() * 0.6 + 0.35,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          phase: Math.random() * Math.PI * 2,
          isSparkle,
          driftSpeedX: (Math.random() - 0.5) * 0.08,
          driftSpeedY: (Math.random() - 0.5) * 0.04,
        });
      }

      // Add a few subtle constellations
      constellations = [
        { x: width * 0.15, y: height * 0.35, size: 2.2, connectedTo: 1 },
        { x: width * 0.22, y: height * 0.28, size: 2.5, connectedTo: 2 },
        { x: width * 0.28, y: height * 0.42, size: 2.0 },
        
        { x: width * 0.68, y: height * 0.22, size: 2.2, connectedTo: 4 },
        { x: width * 0.76, y: height * 0.29, size: 2.8, connectedTo: 5 },
        { x: width * 0.85, y: height * 0.38, size: 2.4 },
      ];
    };

    initParticles();

    // Render loop
    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Draw faint constellation lines
      ctx.strokeStyle = 'rgba(255, 180, 210, 0.16)';
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

      // Draw constellation stars
      for (let i = 0; i < constellations.length; i++) {
        const star = constellations[i];
        const pulse = Math.sin(tick * 0.03 + i) * 0.3 + 0.7;
        
        // Star glow
        const radGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
        radGlow.addColorStop(0, `rgba(255, 230, 180, ${0.8 * pulse})`);
        radGlow.addColorStop(1, 'rgba(255, 200, 220, 0)');
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Star core
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * pulse})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw stardust particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.twinkleSpeed;
        p.x += p.driftSpeedX;
        p.y += p.driftSpeedY;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = Math.max(0.1, Math.min(1, p.baseAlpha + Math.sin(p.phase) * 0.35));

        if (p.isSparkle) {
          // Draw 4-point star sparkle
          const s = p.size * (1 + Math.sin(p.phase) * 0.3);
          ctx.fillStyle = `${p.color}${currentAlpha})`;
          
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - s * 2.5);
          ctx.quadraticCurveTo(p.x, p.y, p.x + s * 2.5, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + s * 2.5);
          ctx.quadraticCurveTo(p.x, p.y, p.x - s * 2.5, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - s * 2.5);
          ctx.fill();

          // Soft central flare
          const flare = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s * 3);
          flare.addColorStop(0, `rgba(255, 240, 200, ${currentAlpha * 0.5})`);
          flare.addColorStop(1, 'rgba(255, 180, 210, 0)');
          ctx.fillStyle = flare;
          ctx.beginPath();
          ctx.arc(p.x, p.y, s * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Normal star dot with subtle aura
          ctx.fillStyle = `${p.color}${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <div className={`relative overflow-hidden bg-[#140207] ${className}`}>
      {/* Layer 1: Deep Crimson Cosmic Base Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, #3d0817 0%, #24040d 45%, #120106 100%)',
        }}
      />

      {/* Layer 2: Glowing Pink/Magenta Cosmic Nebula Clouds */}
      <div 
        className="absolute -top-[15%] right-[5%] w-[650px] h-[500px] rounded-full pointer-events-none blur-[90px] opacity-70 animate-float-slow"
        style={{
          background: 'radial-gradient(circle, rgba(228, 65, 118, 0.45) 0%, rgba(180, 30, 80, 0.25) 45%, transparent 70%)',
        }}
      />
      <div 
        className="absolute top-[40%] -left-[10%] w-[580px] h-[450px] rounded-full pointer-events-none blur-[95px] opacity-60 animate-float-slow"
        style={{
          animationDelay: '3s',
          background: 'radial-gradient(circle, rgba(214, 51, 108, 0.4) 0%, rgba(150, 20, 65, 0.2) 50%, transparent 75%)',
        }}
      />
      <div 
        className="absolute bottom-[5%] right-[20%] w-[500px] h-[400px] rounded-full pointer-events-none blur-[85px] opacity-65 animate-float-slow"
        style={{
          animationDelay: '1.5s',
          background: 'radial-gradient(circle, rgba(255, 110, 160, 0.35) 0%, rgba(170, 30, 75, 0.2) 45%, transparent 70%)',
        }}
      />
      
      {/* Warm Golden Core Aura */}
      <div 
        className="absolute top-[25%] right-[25%] w-[350px] h-[250px] rounded-full pointer-events-none blur-[70px] opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(255, 200, 115, 0.3) 0%, rgba(220, 80, 110, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* Layer 3: Interactive Stardust & Constellations Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
