"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors, Home, PlusCircle, History, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  shopName: string;
}

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "New Trial", href: "/dashboard/new-trial", icon: PlusCircle },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ shopName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="w-[240px] flex-shrink-0 bg-[#0E0E15] border-r border-[rgba(255,255,255,0.05)] h-screen hidden md:flex flex-col sticky top-0">
        <div className="p-6 pb-8 border-b border-[rgba(255,255,255,0.05)]">
          <Link href="/" className="flex items-center gap-2 mb-2 group">
            <Scissors className="h-6 w-6 text-[var(--accent-gold)] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-2xl font-[family-name:var(--font-display)] tracking-widest text-[var(--accent-gold)] uppercase">
              FitLook
            </span>
          </Link>
          <div className="text-[clamp(12px,2.5vw,14px)] text-[var(--text-secondary)] font-medium tracking-wide truncate">
            {shopName}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-[20px] py-[10px] rounded-[10px] text-[clamp(12px,2.5vw,14px)] font-medium transition-all duration-150 border-l-[3px] border-transparent relative overflow-hidden group",
                  isActive 
                    ? "text-[var(--accent-gold)] bg-[rgba(201,168,76,0.08)] !border-[var(--accent-gold)]" 
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]"
                )}
              >
                <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-[var(--accent-gold)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[rgba(255,255,255,0.05)]">
          <div className="bg-[rgba(255,255,255,0.03)] rounded-[12px] p-4 border border-[rgba(255,255,255,0.05)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[clamp(10px,2vw,12px)] font-medium text-[var(--text-secondary)]">Trials Used</span>
              <span className="text-[clamp(10px,2vw,12px)] font-bold text-[var(--text-primary)]">3 / 10</span>
            </div>
            <div className="w-full h-[6px] bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent-gold)] rounded-full w-[30%] shadow-[var(--glow-gold)]" />
            </div>
            <Link href="/dashboard/billing" className="block mt-3 text-[clamp(10px,2vw,12px)] text-[var(--accent-gold)] hover:underline text-center font-medium">
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0E0E15] border-t border-[rgba(255,255,255,0.08)] pb-safe">
        <nav className="flex items-center justify-around h-[64px] px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full space-y-1 relative"
              >
                {isActive && (
                  <div className="absolute top-0 w-8 h-[2px] bg-[var(--accent-gold)] shadow-[var(--glow-gold)]" />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? "text-[var(--accent-gold)]" : "text-[var(--text-muted)]")} />
                <span className={cn("text-[clamp(10px,2vw,12px)] font-medium", isActive ? "text-[var(--accent-gold)]" : "text-[var(--text-secondary)]")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
