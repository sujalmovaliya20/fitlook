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
    <aside className="fixed inset-y-0 left-0 w-[240px] bg-[var(--bg-parchment)] border-r border-[var(--stitch)] hidden md:flex flex-col z-40">
      <div className="p-6 flex gap-3 items-center">
        <img src="/logo.png" alt="FitLook Logo" className="w-10 h-10 object-cover rounded-md shadow-sm border border-[var(--accent-border)] bg-[var(--bg-card)]" />
        <div>
          <h1 className="brand-name mb-1">
            FitLook
          </h1>
          <p className="brand-label">
            Tailor Shop
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-nav-item flex items-center gap-3",
                isActive ? "active" : ""
              )}
            >
              <item.icon className={cn("w-[16px] h-[16px]", isActive ? "text-[var(--accent-gold)]" : "")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mb-4">
        <button
          onClick={handleLogout}
          className="sidebar-logout"
        >
          <LogOut className="w-[16px] h-[16px]" />
          Logout
        </button>
      </div>

      <div className="p-6 pt-5 border-t border-[var(--accent-border)] mt-auto">
        <p className="sidebar-footer-label mb-2">Generations Used</p>
        <div className="w-full h-[4px] bg-[var(--accent-border)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--accent-gold)] w-[40%] rounded-full"></div>
        </div>
        <p className="sidebar-footer-count mt-1 text-right">400 / 1000</p>
      </div>
    </aside>
  );
}
