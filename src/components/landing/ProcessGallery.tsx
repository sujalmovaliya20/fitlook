"use client";

import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

const steps = [
  {
    id: 1,
    title: "Fabric",
    subtitle: "Upload a photo of your unstitched cloth to begin.",
    image: "/atelier_fabric.png",
  },
  {
    id: 2,
    title: "Customer",
    subtitle: "Enter exact customer measurements and details.",
    image: "/atelier_measurements.png",
  },
  {
    id: 3,
    title: "Style",
    subtitle: "Choose the collar, cuffs, and fit from our catalog.",
    image: "/atelier_style.png",
  },
  {
    id: 4,
    title: "Confirm",
    subtitle: "Review and start the digital tailoring process.",
    image: "/atelier_confirm.png",
  }
];

export function ProcessGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isScrolling) return;
    
    // Threshold to prevent ultra-sensitive trackpad triggers
    if (Math.abs(e.deltaY) < 10 && Math.abs(e.deltaX) < 10) return;

    if (e.deltaY > 0 || e.deltaX > 0) {
      if (activeIndex < steps.length - 1) {
        setIsScrolling(true);
        setActiveIndex(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 600);
      }
    } else if (e.deltaY < 0 || e.deltaX < 0) {
      if (activeIndex > 0) {
        setIsScrolling(true);
        setActiveIndex(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 600);
      }
    }
  }, [activeIndex, isScrolling]);

  return (
    <section 
      onWheel={handleWheel}
      className="relative w-full min-h-screen bg-[#0A0A0F] py-24 flex flex-col items-center justify-center overflow-hidden z-20"
    >
      <div className="relative text-center z-30 mb-12 md:mb-16 mt-[-40px]">
        <h2 
          className="text-[40px] md:text-[56px] text-white font-light mb-4"
          style={{ fontFamily: '"Cormorant Garamond", serif', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
        >
          The Atelier Process
        </h2>
        <p className="text-[#C9A84C] text-[14px] uppercase tracking-[0.2em] font-light" style={{ fontFamily: '"DM Sans", sans-serif' }}>
          Step Inside
        </p>
      </div>

      {/* Gallery Container */}
      <div className="w-full max-w-[1200px] px-4 md:px-8 mx-auto z-30">
        <div className="flex flex-row items-center justify-center gap-2 md:gap-4 h-[50vh] md:h-[480px]">
          {steps.map((step, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={step.id}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-full overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center group",
                  isActive ? "w-[60%] md:w-[800px]" : "w-[15%] md:w-[100px] hover:w-[20%] md:hover:w-[120px]"
                )}
                style={{ 
                  filter: isActive ? 'grayscale(0%) brightness(100%)' : 'grayscale(50%) brightness(60%)',
                }}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-1000 ease-out"
                  style={{ 
                    backgroundImage: `url('${step.image}')`,
                    transform: isActive ? 'scale(1.05)' : 'scale(1)' 
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  isActive 
                    ? "bg-gradient-to-t from-[#0A0A0F] via-black/20 to-transparent opacity-90" 
                    : "bg-black/40 group-hover:bg-black/20"
                )} />

                {/* Content */}
                <div className={cn(
                  "absolute inset-0 flex flex-col justify-end p-6 md:p-12 transition-all duration-500 delay-200",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                )}>
                  <span className="text-[#C9A84C] text-[10px] md:text-[12px] uppercase tracking-[0.3em] mb-2 md:mb-3 font-light block">
                    Step {step.id}
                  </span>
                  <h3 
                    className="text-[28px] md:text-[48px] text-white leading-tight mb-2 md:mb-4"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-white/70 text-[13px] md:text-[15px] font-light max-w-md hidden md:block" style={{ fontFamily: '"DM Sans", sans-serif' }}>
                    {step.subtitle}
                  </p>
                </div>

                {/* Vertical Text for inactive items */}
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                  !isActive ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                  <span 
                    className="text-white text-[12px] md:text-[14px] uppercase tracking-[0.3em] font-light whitespace-nowrap -rotate-90 block"
                    style={{ fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Indicator */}
      <div className="absolute bottom-8 md:bottom-12 text-white/50 text-[13px] tracking-[0.2em] z-30" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        {activeIndex + 1} — {steps.length}
      </div>
    </section>
  );
}
