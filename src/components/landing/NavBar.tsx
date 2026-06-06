"use client";

import Link from "next/link";
import { Scissors, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface NavBarProps {
  scrollProgress: number;
}

export function NavBar({ scrollProgress }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const logoColor = "#C9A84C"; // Gold
  const textColor = "#E8DCC8"; // Parchment Cream
  
  // Fade out the navbar background slightly as we go deep into the 3D scene, 
  // but keep the stitched border and text visible for navigation.
  const bgOpacity = scrollProgress > 0.3 ? Math.max(0.3, 0.8 - scrollProgress) : 0.8;

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-sm"
      style={{
        backgroundColor: `rgba(15, 10, 6, ${bgOpacity})`,
        borderBottom: '1px dashed rgba(201, 168, 76, 0.3)' // Subtle gold stitched border
      }}
    >
      <div className="container mx-auto flex h-[76px] items-center justify-between px-6 md:px-4 md:px-4 lg:px-8 lg:px-12">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="FitLook Logo" 
            width={40}
            height={40}
            priority
            className="w-8 h-8 md:w-10 md:h-10 object-cover rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-[#C9A84C]/40 bg-[#F7F3EC]" 
          />
          <span 
            className="text-[clamp(20px,5vw,30px)] tracking-[0.1em] uppercase"
            style={{ color: logoColor, fontFamily: '"Cormorant Garamond", serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            FitLook
          </span>
        </div>
        
        {/* NAV LINKS DESKTOP */}
        <div className="hidden md:flex items-center gap-4 md:p-6 lg:p-8">
          <Link 
            href="/auth/login" 
            className="relative group text-[clamp(12px,2.5vw,14px)] tracking-[0.15em] font-light uppercase transition-colors"
            style={{ color: textColor, fontFamily: '"DM Sans", sans-serif' }}
          >
            <span>Sign In</span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] border-b border-dashed border-[#C9A84C] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          <Link href="/auth/signup">
            <button 
              className="relative group bg-[#150E09] hover:bg-[#1C130D] text-[#C9A84C] px-4 lg:px-8 py-3 font-medium tracking-[0.15em] uppercase text-[clamp(10px,2vw,12px)] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)] w-full sm:w-auto min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              <div className="absolute inset-0 border border-dashed border-[#C9A84C]/40 m-[4px] pointer-events-none group-hover:border-[#C9A84C]/80 transition-colors duration-300"></div>
              <span className="relative z-10">Measure Now</span>
            </button>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/auth/signup" className="sm:hidden">
            <button 
              className="relative group bg-[#150E09] hover:bg-[#1C130D] text-[#C9A84C] px-4 py-2 font-medium tracking-[0.15em] uppercase text-[10px] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              <div className="absolute inset-0 border border-dashed border-[#C9A84C]/40 m-[2px] pointer-events-none"></div>
              <span className="relative z-10">Measure</span>
            </button>
          </Link>
          <button 
            className="text-[#C9A84C] min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="md:hidden absolute top-[76px] left-0 w-full bg-[#150E09]/95 backdrop-blur-lg border-b border-dashed border-[#C9A84C]/30 flex flex-col p-6 gap-6">
          <Link 
            href="/auth/login" 
            className="text-[14px] tracking-[0.15em] font-light uppercase text-[#E8DCC8] p-2 min-h-[44px] flex items-center"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
          <Link href="/auth/signup" className="hidden sm:block" onClick={() => setIsOpen(false)}>
            <button className="relative group bg-[#150E09] hover:bg-[#1C130D] text-[#C9A84C] px-4 lg:px-8 py-3 font-medium tracking-[0.15em] uppercase text-[12px] transition-all w-full min-h-[44px] flex items-center justify-center">
              <div className="absolute inset-0 border border-dashed border-[#C9A84C]/40 m-[4px] pointer-events-none"></div>
              <span className="relative z-10">Measure Now</span>
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}
