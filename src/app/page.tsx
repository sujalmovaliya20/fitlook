"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { NavBar } from '@/components/landing/NavBar';
import { ExteriorSection } from '@/components/landing/ExteriorSection';

const TailorInterior = dynamic(
  () => import('@/components/landing/TailorInterior').then((mod) => mod.TailorInterior),
  { ssr: false }
);

const CTASection = dynamic(
  () => import('@/components/landing/CTASection').then((mod) => mod.CTASection),
  { ssr: false }
);

export default function Home() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize Lenis for buttery smooth scrolling, especially on mobile touch
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2, // Enhances mobile scroll feeling
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    let st: globalThis.ScrollTrigger | null = null;
    if (containerRef.current) {
      st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          setProgress(self.progress);
        }
      });
    }

    return () => {
      if (st) st.kill();
      lenis.destroy();
    };
  }, []);

  // Door flash transition (30% to 40%)
  const showDoorFlash = progress >= 0.3 && progress <= 0.4;
  let doorScale = 1;
  let doorOpacity = 0;
  if (showDoorFlash) {
    const localP = (progress - 0.3) / 0.1;
    doorScale = 0.5 + localP * 10;
    doorOpacity = localP < 0.8 ? 1 : 1 - ((localP - 0.8) / 0.2);
  }

  return (
    <main ref={containerRef} className="w-full bg-[#0A0A0F]" style={{ height: '600vh' }}>
      <div className="sticky top-0 w-full min-h-[100svh] h-[100svh] overflow-hidden bg-[#0A0A0F]">
        
        {progress < 0.35 && (
          <ExteriorSection progress={progress} />
        )}
        
        {showDoorFlash && (
           <div 
             className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
             style={{ backgroundColor: '#2C1A0E' }}
           >
             <div 
               className="border-[20px] border-[#4A2E1B] shadow-2xl"
               style={{
                 width: '200px',
                 height: '400px',
                 transform: `scale(${doorScale})`,
                 opacity: doorOpacity,
                 transformOrigin: 'center center'
               }}
             />
           </div>
        )}
        
        {progress >= 0.35 && progress < 0.95 && (
          <TailorInterior progress={progress} />
        )}

        {progress >= 0.92 && (
          <div className="absolute inset-0 z-30" style={{ opacity: progress >= 0.95 ? 1 : (progress - 0.92) / 0.03 }}>
            <CTASection />
          </div>
        )}

        <NavBar scrollProgress={progress} />
      </div>
    </main>
  );
}
