"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { FabricCard } from "@/components/tailor/FabricCard";
import { ChalkLabel } from "@/components/tailor/ChalkLabel";
import { ThreadButton } from "@/components/tailor/ThreadButton";
import { MeasureDivider } from "@/components/tailor/MeasureDivider";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <FabricCard className="p-[40px_48px] flex flex-col items-center w-full">
      {/* TOP OF CARD */}
      <div className="w-12 h-12 mb-6 flex items-center justify-center relative">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Spool */}
          <rect x="18" y="32" width="12" height="12" fill="var(--ink-faint)" />
          <rect x="14" y="32" width="20" height="3" fill="var(--ink-faint)" />
          <rect x="14" y="41" width="20" height="3" fill="var(--ink-faint)" />
          {/* Thread on spool */}
          <rect x="18" y="35" width="12" height="6" fill="var(--thread-gold)" />
          {/* Thimble */}
          <path d="M18 10 C18 6, 30 6, 30 10 L32 26 L16 26 Z" fill="var(--ink-faint)" />
          <circle cx="21" cy="12" r="1" fill="var(--bg-card)" />
          <circle cx="24" cy="13" r="1" fill="var(--bg-card)" />
          <circle cx="27" cy="12" r="1" fill="var(--bg-card)" />
          <circle cx="22" cy="16" r="1" fill="var(--bg-card)" />
          <circle cx="26" cy="16" r="1" fill="var(--bg-card)" />
          <circle cx="20" cy="20" r="1" fill="var(--bg-card)" />
          <circle cx="24" cy="20" r="1" fill="var(--bg-card)" />
          <circle cx="28" cy="20" r="1" fill="var(--bg-card)" />
        </svg>
      </div>

      <div className="text-center w-full mb-8">
        <p className="font-[family-name:var(--font-serif)] italic text-[clamp(12px,2.5vw,14px)] text-[var(--ink-light)] mb-2">Welcome back to FitLook</p>
        <h1 className="font-[family-name:var(--font-serif)] text-[clamp(20px,5vw,30px)] text-[var(--ink-dark)] leading-tight">Sign in to your atelier</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-[var(--fabric-red)]/10 text-[var(--fabric-red)] border border-[var(--fabric-red)]/20 rounded-[6px] text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <ChalkLabel htmlFor="email">Email Address</ChalkLabel>
          <input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="master@atelier.com"
            required 
            disabled={isPending}
            className="w-full h-[46px] px-[14px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <ChalkLabel htmlFor="password">Password</ChalkLabel>
            <Link href="#" className="font-[family-name:var(--font-sans)] text-[clamp(10px,2vw,12px)] text-[var(--ink-light)] hover:text-[var(--thread-gold)] transition-colors">Forgot?</Link>
          </div>
          <div className="relative">
            <input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              required 
              disabled={isPending}
              className="w-full h-[46px] pl-[14px] pr-[40px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-light)] hover:text-[var(--ink-mid)] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <ThreadButton type="submit" className="w-full h-[48px] mt-[8px]" isLoading={isPending}>
          Enter the shop
        </ThreadButton>
      </form>

      <div className="w-full mt-8 flex flex-col items-center gap-6">
        <MeasureDivider />
        <Link href="/auth/signup" className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] hover:text-[var(--thread-gold)] transition-colors">
          New to FitLook? Create your shop &rarr;
        </Link>
      </div>
    </FabricCard>
  );
}
