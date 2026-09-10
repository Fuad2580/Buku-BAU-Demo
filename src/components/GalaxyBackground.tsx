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

    // Floating water / serum champagne bubbles
    interface WaterBubble {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      swaySpeed: number;
      swayAmp: number;
      phase: number;
      baseAlpha: number;
      tint: 'rose' | 'pearl' | 'gold';
    }
    let bubbles: WaterBubble[] = [];

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
      const particleCount = intensity === 'full' ? Math.min(300, Math.floor((width * height) / 3400)) : 140;

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

      // Initialize abundant floating water/champagne bubbles
      bubbles = [];
      const bubbleCount = intensity === 'full' ? Math.min(75, Math.max(35, Math.floor((width * height) / 12000))) : 30;
      for (let i = 0; i < bubbleCount; i++) {
        const tintRand = Math.random();
        bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 15 + 4, // 4px to 19px
          speedY: Math.random() * 0.45 + 0.15,
          swaySpeed: Math.random() * 0.02 + 0.008,
          swayAmp: Math.random() * 1.2 + 0.4,
          phase: Math.random() * Math.PI * 2,
          baseAlpha: Math.random() * 0.45 + 0.2,
          tint: tintRand < 0.55 ? 'rose' : tintRand < 0.85 ? 'pearl' : 'gold',
        });
      }

      // Add subtle constellations
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

      // Draw drifting water / champagne bubbles
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];
        b.y -= b.speedY;
        b.phase += b.swaySpeed;
        b.x += Math.sin(b.phase) * b.swayAmp;

        // Wrap around borders
        if (b.y < -30) {
          b.y = height + 30;
          b.x = Math.random() * width;
        }
        if (b.x < -30) b.x = width + 20;
        if (b.x > width + 30) b.x = -20;

        const alpha = b.baseAlpha * (0.8 + Math.sin(b.phase) * 0.2);

        // Outer bubble rim & spherical gradient
        const grad = ctx.createRadialGradient(
          b.x - b.radius * 0.25,
          b.y - b.radius * 0.25,
          b.radius * 0.1,
          b.x,
          b.y,
          b.radius
        );

        if (b.tint === 'rose') {
          grad.addColorStop(0, `rgba(255, 235, 245, ${alpha * 0.75})`);
          grad.addColorStop(0.45, `rgba(255, 170, 200, ${alpha * 0.3})`);
          grad.addColorStop(0.85, `rgba(229, 57, 101, ${alpha * 0.55})`);
          grad.addColorStop(1, `rgba(255, 210, 230, ${alpha * 0.85})`);
        } else if (b.tint === 'gold') {
          grad.addColorStop(0, `rgba(255, 250, 220, ${alpha * 0.75})`);
          grad.addColorStop(0.45, `rgba(255, 220, 150, ${alpha * 0.25})`);
          grad.addColorStop(0.85, `rgba(245, 180, 80, ${alpha * 0.5})`);
          grad.addColorStop(1, `rgba(255, 235, 180, ${alpha * 0.8})`);
        } else {
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.85})`);
          grad.addColorStop(0.4, `rgba(255, 225, 238, ${alpha * 0.25})`);
          grad.addColorStop(0.85, `rgba(255, 185, 215, ${alpha * 0.45})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.8})`);
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Primary specular gleam at top-left
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.95, alpha * 1.6)})`;
        ctx.beginPath();
        ctx.arc(
          b.x - b.radius * 0.35,
          b.y - b.radius * 0.35,
          Math.max(1, b.radius * 0.24),
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Secondary subtle bounce light at bottom-right
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.45})`;
        ctx.beginPath();
        ctx.arc(
          b.x + b.radius * 0.32,
          b.y + b.radius * 0.32,
          Math.max(0.6, b.radius * 0.12),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  const isPositioned = className.includes('absolute') || className.includes('fixed');

  return (
    <div className={`${isPositioned ? '' : 'relative'} bg-[#140207] ${className}`}>
      {/* Background Visual Layers (clipped strictly within background layer so position:sticky works on children) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
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

      {/* Layer 3: Silk-Water Ripples & Organic Waves (Matching Reference Photo 2) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 80% 90%, rgba(255, 180, 210, 0.18) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 10%, rgba(255, 200, 220, 0.15) 0%, transparent 55%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%, rgba(255, 150, 180, 0.04) 100%)
          `
        }}
      />
      
      {/* Curved Silk Wave Flow */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none" viewBox="0 0 1440 900">
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
            <stop offset="50%" stopColor="#E53965" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#7E1730" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="silk-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFD285" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#D82A58" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#3B0512" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3D Glossy Translucent Pearl Orbs & Water Bubbles (Abundant density) */}
      {/* Orb 1: Upper Left Hero Pearl */}
      <div 
        className="absolute top-[12%] -left-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full pointer-events-none z-1 animate-float-slow opacity-80"
        style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 225, 235, 0.75) 28%, rgba(244, 160, 185, 0.45) 60%, rgba(160, 30, 70, 0.25) 100%)',
          boxShadow: 'inset -8px -8px 20px rgba(90, 10, 35, 0.6), inset 3px 3px 12px rgba(255, 255, 255, 0.8), 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 180, 205, 0.35)',
          backdropFilter: 'blur(3px)',
        }}
      />
      {/* Orb 2: Top Right Floating Water Bubble */}
      <div 
        className="absolute top-[6%] right-[12%] w-14 h-14 sm:w-18 sm:h-18 rounded-full pointer-events-none z-1 animate-float-slow opacity-70"
        style={{
          animationDelay: '1.2s',
          background: 'radial-gradient(circle at 34% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 235, 245, 0.65) 25%, rgba(240, 140, 175, 0.3) 65%, rgba(140, 15, 55, 0.15) 100%)',
          boxShadow: 'inset -5px -5px 14px rgba(80, 8, 30, 0.5), inset 2px 2px 8px rgba(255, 255, 255, 0.85), 0 10px 20px rgba(0, 0, 0, 0.45), 0 0 22px rgba(255, 170, 200, 0.3)',
        }}
      />
      {/* Orb 3: Mid-Upper Right Rose Bubble */}
      <div 
        className="absolute top-[36%] -right-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full pointer-events-none z-1 animate-float-slow opacity-65"
        style={{
          animationDelay: '3.1s',
          background: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 220, 235, 0.6) 30%, rgba(230, 130, 165, 0.35) 60%, rgba(130, 15, 50, 0.2) 100%)',
          boxShadow: 'inset -7px -7px 18px rgba(75, 10, 30, 0.55), inset 3px 3px 10px rgba(255, 255, 255, 0.8), 0 15px 30px rgba(0, 0, 0, 0.45)',
        }}
      />
      {/* Orb 4: Mid-Lower Right Hero Pearl */}
      <div 
        className="absolute top-[62%] -right-10 w-32 h-32 sm:w-44 sm:h-44 rounded-full pointer-events-none z-1 animate-float-slow opacity-75"
        style={{
          animationDelay: '2.5s',
          background: 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 230, 240, 0.7) 25%, rgba(235, 145, 175, 0.4) 60%, rgba(140, 20, 60, 0.2) 100%)',
          boxShadow: 'inset -10px -10px 24px rgba(70, 8, 28, 0.65), inset 4px 4px 14px rgba(255, 255, 255, 0.85), 0 25px 45px rgba(0, 0, 0, 0.55), 0 0 35px rgba(255, 160, 190, 0.3)',
          backdropFilter: 'blur(4px)',
        }}
      />
      {/* Orb 5: Mid-Left Floating Bubble */}
      <div 
        className="absolute top-[48%] left-[3%] w-18 h-18 sm:w-22 sm:h-22 rounded-full pointer-events-none z-1 animate-float-slow opacity-70"
        style={{
          animationDelay: '0.8s',
          background: 'radial-gradient(circle at 36% 32%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 230, 240, 0.65) 28%, rgba(230, 140, 170, 0.35) 60%, rgba(120, 15, 45, 0.15) 100%)',
          boxShadow: 'inset -6px -6px 16px rgba(80, 10, 32, 0.5), inset 3px 3px 10px rgba(255, 255, 255, 0.8), 0 14px 28px rgba(0, 0, 0, 0.4), 0 0 24px rgba(255, 165, 195, 0.3)',
        }}
      />
      {/* Orb 6: Bottom Left Pearl */}
      <div 
        className="absolute bottom-[10%] left-[8%] w-18 h-18 sm:w-24 sm:h-24 rounded-full pointer-events-none z-1 animate-float-slow opacity-65"
        style={{
          animationDelay: '4s',
          background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 225, 235, 0.65) 30%, rgba(240, 150, 180, 0.35) 65%, rgba(150, 25, 65, 0.15) 100%)',
          boxShadow: 'inset -6px -6px 16px rgba(90, 10, 35, 0.5), 0 14px 28px rgba(0, 0, 0, 0.4), 0 0 22px rgba(255, 180, 210, 0.25)',
        }}
      />
      {/* Orb 7: Lower Center Floating Champagne Bubble */}
      <div 
        className="absolute bottom-[5%] left-[45%] w-14 h-14 sm:w-16 sm:h-16 rounded-full pointer-events-none z-1 animate-float-slow opacity-60 hidden md:block"
        style={{
          animationDelay: '1.8s',
          background: 'radial-gradient(circle at 35% 30%, rgba(255, 250, 235, 0.95) 0%, rgba(255, 235, 205, 0.6) 28%, rgba(240, 180, 120, 0.3) 65%, rgba(140, 30, 60, 0.15) 100%)',
          boxShadow: 'inset -4px -4px 12px rgba(90, 20, 40, 0.45), 0 10px 20px rgba(0, 0, 0, 0.35), 0 0 20px rgba(255, 215, 160, 0.3)',
        }}
      />
      {/* Orb 8: Micro-dewdrop 1 */}
      <div 
        className="absolute top-[24%] left-[20%] w-8 h-8 rounded-full pointer-events-none z-1 animate-float-slow opacity-50 hidden sm:block"
        style={{
          animationDelay: '2.2s',
          background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 220, 235, 0.5) 50%, rgba(180, 30, 80, 0.1) 100%)',
          boxShadow: '0 0 12px rgba(255, 200, 225, 0.4)',
        }}
      />
      {/* Orb 9: Micro-dewdrop 2 */}
      <div 
        className="absolute bottom-[24%] right-[22%] w-10 h-10 rounded-full pointer-events-none z-1 animate-float-slow opacity-55 hidden sm:block"
        style={{
          animationDelay: '3.6s',
          background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 225, 240, 0.5) 50%, rgba(200, 40, 90, 0.15) 100%)',
          boxShadow: '0 0 14px rgba(255, 180, 210, 0.35)',
        }}
      />

      {/* Layer 4: Interactive Stardust & Constellations Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
      />
      </div>

      {/* Content wrapper - natural overflow allowing sticky children to track window scroll */}
      {children && (
        <div className="relative z-10 w-full flex-1 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
