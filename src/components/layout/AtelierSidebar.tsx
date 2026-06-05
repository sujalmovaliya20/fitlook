"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';
import { Home, PlusCircle, History, CreditCard, Settings, LogOut, User } from 'lucide-react';

export function AtelierSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'New Trial', href: '/dashboard/new-trial', icon: PlusCircle },
    { label: 'History', href: '/dashboard/history', icon: History },
    { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] bg-[var(--bg-parchment)] border-r border-[var(--stitch)] flex flex-col z-40">
      <div className="p-6">
        <h1 className="text-[clamp(16px,4vw,20px)] font-[family-name:var(--font-serif)] italic text-[var(--ink-dark)] mb-1">
          FitLook
        </h1>
        <p className="text-[clamp(10px,2vw,12px)] font-[family-name:var(--font-sans)] font-light text-[var(--ink-light)] uppercase tracking-[0.1em]">
          Tailor Shop
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[clamp(12px,2.5vw,14px)] font-[family-name:var(--font-sans)] transition-colors",
                isActive 
                  ? "bg-[var(--thread-muted)] text-[var(--ink-dark)] font-bold border-l-[2px] border-[var(--thread-gold)] rounded-l-none" 
                  : "text-[var(--ink-mid)] hover:bg-[var(--bg-surface)] hover:text-[var(--ink-dark)]"
              )}
            >
              <item.icon className={cn("w-[16px] h-[16px]", isActive ? "text-[var(--thread-gold)]" : "")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-[clamp(12px,2.5vw,14px)] font-[family-name:var(--font-sans)] text-[var(--ink-mid)] hover:bg-[rgba(139,26,26,0.05)] hover:text-[var(--fabric-red)] transition-colors"
        >
          <LogOut className="w-[16px] h-[16px]" />
          Logout
        </button>
      </div>

      <div className="p-6 pt-5 border-t border-[var(--stitch)] mt-auto">
        <p className="text-[clamp(10px,2vw,12px)] uppercase tracking-[0.1em] text-[var(--ink-light)] mb-2">Generations Used</p>
        <div className="w-full h-[4px] bg-[var(--stitch)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--thread-gold)] w-[40%]"></div>
        </div>
        <p className="text-[clamp(10px,2vw,12px)] font-[family-name:var(--font-mono)] text-[var(--ink-mid)] mt-1 text-right">400 / 1000</p>
      </div>
    </aside>
  );
}
