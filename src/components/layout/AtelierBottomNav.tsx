"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, PlusCircle, History, User, Settings } from 'lucide-react';

export function AtelierBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'New Trial', href: '/dashboard/new-trial', icon: PlusCircle },
    { label: 'History', href: '/dashboard/history', icon: History },
    { label: 'Profile', href: '/dashboard/profile', icon: User },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-[var(--bg-parchment)] border-t border-[var(--stitch)] z-50 flex items-center justify-around px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-[48px] h-[48px] rounded-lg transition-colors",
              isActive 
                ? "text-[var(--thread-gold)]" 
                : "text-[var(--ink-mid)] hover:text-[var(--ink-dark)]"
            )}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        );
      })}
    </nav>
  );
}
