"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function AtelierTopbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="h-[64px] bg-[var(--bg-warm-white)] border-b border-[var(--stitch)] flex items-center justify-between px-4 md:px-6 z-30 sticky top-0">
      <div className="flex items-center">
        <h2 className="text-lg md:text-2xl font-[family-name:var(--font-serif)] text-[var(--ink-dark)] truncate max-w-[200px] sm:max-w-none">
          Studio Overview
        </h2>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-[44px] h-[44px] rounded-full bg-[url('data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'%3E%3Cfilter id=\\'n\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.5\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100\\' height=\\'100\\' filter=\\'url(%23n)\\' opacity=\\'0.1\\'/%3E%3C/svg%3E')] bg-[#F0EBE3] border border-[var(--stitch-strong)] flex items-center justify-center shadow-sm hover:border-[var(--thread-gold)] transition-colors focus:outline-none shrink-0"
        >
          <span className="text-[clamp(10px,2vw,12px)] font-[family-name:var(--font-sans)] text-[var(--thread-gold)] font-bold">SM</span>
        </button>

        {isOpen && (
          <div className="absolute top-[44px] right-0 w-[180px] bg-[var(--bg-parchment)] border border-[var(--stitch-strong)] rounded-[6px] shadow-lg py-1 flex flex-col z-50 animate-in slide-in-from-top-2 duration-200">
            <Link 
              href="/dashboard/profile" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-[clamp(12px,2.5vw,14px)] font-[family-name:var(--font-sans)] text-[var(--ink-dark)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <User className="w-[14px] h-[14px] text-[var(--ink-mid)]" />
              Profile
            </Link>
            <div className="h-[1px] bg-[var(--stitch)] my-1 w-full" />
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-[clamp(12px,2.5vw,14px)] font-[family-name:var(--font-sans)] text-[var(--fabric-red)] hover:bg-[rgba(139,26,26,0.05)] transition-colors text-left"
            >
              <LogOut className="w-[14px] h-[14px]" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
