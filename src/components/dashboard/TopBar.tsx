"use client";

import { usePathname } from "next/navigation";
import { Bell, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  shopName: string;
}

export function TopBar({ shopName }: TopBarProps) {
  const pathname = usePathname();
  
  // Determine page title based on route
  let pageTitle = "Dashboard";
  if (pathname.includes("/new-trial")) pageTitle = "New Virtual Trial";
  else if (pathname.includes("/history")) pageTitle = "Trial History";
  else if (pathname.includes("/billing")) pageTitle = "Billing & Plans";
  else if (pathname.includes("/settings")) pageTitle = "Atelier Settings";

  // Get initials
  const initials = shopName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="h-[64px] flex items-center justify-between px-6 lg:px-10 border-b border-[rgba(255,255,255,0.05)] bg-transparent">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle (Placeholder) */}
        <button className="md:hidden text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-[family-name:var(--font-display)] font-medium text-[28px] text-[var(--text-primary)] tracking-wide">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent-red)] rounded-full border border-[#111118]" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[13px] font-medium text-[var(--text-primary)]">{shopName}</span>
            <span className="text-[11px] text-[var(--text-secondary)]">Pro Plan</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)] text-[#0A0A0F] flex items-center justify-center font-bold text-[14px] shadow-[var(--glow-gold)]">
            {initials || "FL"}
          </div>
        </div>
      </div>
    </header>
  );
}
