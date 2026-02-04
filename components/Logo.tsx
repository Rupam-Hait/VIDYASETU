import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const ConfettiOverlay: React.FC<{ x: number, y: number, onClose: () => void }> = ({ x, y, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Full screen canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    let particles: any[] = [];
    const particleCount = 200;

    // Initialize particles at the click origin (x, y)
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 25 + 10; // High initial burst
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            gravity: 0.6,
            drag: 0.94,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            size: Math.random() * 10 + 5, // Confetti size
            color: colors[Math.floor(Math.random() * colors.length)],
            wobble: Math.random() * 10,
            wobbleSpeed: Math.random() * 0.1 + 0.05
        });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach(p => {
        // Physics
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        
        // Rotation and Wobble for paper effect
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        if (p.y < canvas.height + 50) {
            active = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            
            // Draw paper rectangle (confetti)
            // Simulating 3D flip by changing scale based on wobble
            const scaleX = Math.cos(p.wobble);
            ctx.scale(scaleX, 1);
            
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); // Rectangular shape
            ctx.restore();
        }
      });

      if (active) {
        animationId = requestAnimationFrame(animate);
      } else {
        onClose();
      }
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []); // eslint-disable-line

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
};

export const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dim = size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-14 h-14' : 'w-24 h-24';
  const fontSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl';
  const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12';
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [showJoker, setShowJoker] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [burstCoords, setBurstCoords] = useState({ x: 0, y: 0 });

  // Ambient particles effect inside the logo box
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{x: number, y: number, vx: number, vy: number, life: number}> = [];
    let animationFrameId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: Math.random()
      };
    };

    // Initial ambient particles
    for(let i=0; i<10; i++) particles.push(createParticle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ambient generation
      if (Math.random() > 0.9 && particles.length < 50) {
        particles.push(createParticle());
      }

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.life * 0.8})`;
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      });

      // Connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 30) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist/30)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Calculate global coordinates for the burst
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setBurstCoords({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
    } else {
        setBurstCoords({ x: e.clientX, y: e.clientY });
    }

    setShowConfetti(true);
    setShowJoker(true);
    setTimeout(() => setShowJoker(false), 2000);
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="flex items-center gap-3 select-none group cursor-pointer" 
        onClick={handleClick} 
        title="Click for a surprise!"
      >
        {/* Icon Container */}
        <div className={`relative ${dim} flex items-center justify-center`}>
          {/* Glow Effects */}
          <div className="absolute inset-0 bg-cyan-500/40 rounded-xl blur-lg animate-pulse"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-50 blur group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          
          {/* Main Box */}
          <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl w-full h-full flex items-center justify-center border border-white/20 shadow-xl overflow-hidden z-10">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
            
            {/* Joker Overlay */}
            {showJoker && (
              <div className="absolute inset-0 flex items-center justify-center z-50 animate-bounce">
                <span className={`${size === 'sm' ? 'text-2xl' : 'text-4xl'} filter drop-shadow-lg`}>🤡</span>
              </div>
            )}

            {/* Book Icon (Moving) */}
            <div className={`${showJoker ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200 animate-float`}>
               <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className={`${iconSize} drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
               >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
               </svg>
            </div>
          </div>
        </div>
        
        {/* Text */}
        <div className="flex flex-col">
          <div className={`font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-200 ${fontSize} filter drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]`}>
            VIDYASETU
          </div>
        </div>
      </div>

      {/* Full Screen Confetti Portal */}
      {showConfetti && createPortal(
        <ConfettiOverlay 
            x={burstCoords.x} 
            y={burstCoords.y} 
            onClose={() => setShowConfetti(false)} 
        />, 
        document.body
      )}
    </>
  );
};