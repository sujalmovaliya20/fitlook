import React from 'react';

interface ExteriorSectionProps {
  progress: number; // 0 to 1 over the whole page. Exterior is 0 to 0.35
}

export function ExteriorSection({ progress }: ExteriorSectionProps) {
  // We map the global 0->0.30 progress to local 0->1
  const localProgress = Math.min(progress / 0.30, 1);
  
  // Transform scale 1 -> 4
  const scale = 1 + localProgress * 3;
  // Transform Y 0 -> -20vh
  const translateY = -20 * localProgress;
  // Fade out starting at 0.25 global progress
  const opacity = progress > 0.25 ? Math.max(0, 1 - (progress - 0.25) / 0.05) : 1;

  return (
    <section 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden z-10"
      style={{
        backgroundColor: '#0F0A06', // Darker background to match cinematic lighting
        opacity: opacity,
        pointerEvents: opacity > 0 ? 'auto' : 'none'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap');
        
        .swing-animation {
          transform-origin: top center;
          animation: swing 3s ease-in-out infinite;
        }
        @keyframes swing {
          0% { transform: rotate(2deg); }
          50% { transform: rotate(-2deg); }
          100% { transform: rotate(2deg); }
        }
        
        .bounce-arrow {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}} />

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] z-20"></div>

      <div 
        className="relative flex flex-col items-center justify-center w-[80vw] max-w-[600px] aspect-[4/5] md:aspect-[16/9]"
        style={{
          transform: `scale(${scale}) translateY(${translateY}vh)`,
          transformOrigin: 'center 60%', // Zoom towards the door in the image
        }}
      >
        {/* Modern Stitched Tailor Shop Board */}
        <div className="absolute -top-20 text-center z-10 w-full flex justify-center">
          <div className="relative bg-[#150E09] px-10 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-[#0F0A06]">
            {/* Stitched Inner Border */}
            <div className="absolute inset-0 border-[1.5px] border-dashed border-[#C9A84C]/60 m-[6px] pointer-events-none"></div>
            
            <h1 
              className="text-[#C9A84C] text-4xl md:text-5xl tracking-[0.2em] uppercase font-light relative z-10"
              style={{ fontFamily: '"Cormorant Garamond", serif', textShadow: '0 2px 10px rgba(201,168,76,0.2)' }}
            >
              FitLook
            </h1>
            <p 
              className="text-[#E8DCC8]/70 text-[10px] tracking-[0.4em] uppercase mt-2 font-light relative z-10"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              Tailor Shop
            </p>
          </div>
        </div>

        {/* Real Authentic Tailor Shop Image */}
        <div className="w-full h-full rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
          <img 
            src="/atelier_exterior_modern.png" 
            alt="Tailor Shop Window" 
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient to blend edges */}
          <div className="absolute inset-0 border border-white/10 rounded-sm"></div>
        </div>

      </div>

      {/* Down arrow */}
      <div 
        className="absolute bottom-12 flex flex-col items-center bounce-arrow z-30"
        style={{ fontFamily: '"Caveat", cursive', color: '#E8DCC8', fontSize: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
      >
        <span className="mb-2">Enter the shop</span>
        <span>↓</span>
      </div>
    </section>
  );
}
