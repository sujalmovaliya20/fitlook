import Link from "next/link";
import { Scissors } from "lucide-react";

interface NavBarProps {
  scrollProgress: number;
}

export function NavBar({ scrollProgress }: NavBarProps) {
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
      <div className="container mx-auto flex h-[76px] items-center justify-between px-6 md:px-12">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#C9A84C]" strokeWidth={1.5} />
          <span 
            className="text-[28px] tracking-[0.1em] uppercase"
            style={{ color: logoColor, fontFamily: '"Cormorant Garamond", serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            FitLook
          </span>
        </div>
        
        {/* NAV LINKS */}
        <div className="flex items-center gap-8">
          <Link 
            href="/auth/login" 
            className="relative group text-[13px] tracking-[0.15em] hidden sm:block font-light uppercase transition-colors"
            style={{ color: textColor, fontFamily: '"DM Sans", sans-serif' }}
          >
            <span>Sign In</span>
            {/* Hover Stitch Effect */}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] border-b border-dashed border-[#C9A84C] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          <Link href="/auth/signup">
            {/* Bespoke Suit Label Button (Stitch Concept) */}
            <button 
              className="relative group bg-[#150E09] hover:bg-[#1C130D] text-[#C9A84C] px-8 py-3 font-medium tracking-[0.15em] uppercase text-[11px] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
              style={{ fontFamily: '"DM Sans", sans-serif' }}
            >
              {/* Inner Dashed Border (The Gold Stitching) */}
              <div className="absolute inset-0 border border-dashed border-[#C9A84C]/40 m-[4px] pointer-events-none group-hover:border-[#C9A84C]/80 transition-colors duration-300"></div>
              <span className="relative z-10">Measure Now</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
