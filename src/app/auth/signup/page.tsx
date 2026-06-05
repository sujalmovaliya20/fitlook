"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { FabricCard } from "@/components/tailor/FabricCard";
import { ChalkLabel } from "@/components/tailor/ChalkLabel";
import { ThreadButton } from "@/components/tailor/ThreadButton";
import { MeasureDivider } from "@/components/tailor/MeasureDivider";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGooglePending(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) setError(error.message);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      // setIsGooglePending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await signup(formData);
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
        <h1 className="font-[family-name:var(--font-serif)] text-[clamp(20px,5vw,30px)] text-[var(--ink-dark)] leading-tight">Open your atelier</h1>
      </div>

      <div className="w-full flex flex-col gap-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGooglePending || isPending}
          className="w-full h-[46px] px-[14px] flex items-center justify-center gap-3 bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] hover:border-[var(--thread-gold)] transition-colors disabled:opacity-50"
        >
          {isGooglePending ? (
            <div className="w-4 h-4 border-2 border-[var(--stitch)] border-t-[var(--thread-gold)] rounded-full animate-spin"></div>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 w-full py-2">
          <hr className="flex-1 border-none border-t border-[var(--stitch)]" />
          <span className="font-[family-name:var(--font-sans)] text-[11px] uppercase tracking-widest text-[var(--ink-faint)]">or sign up with email</span>
          <hr className="flex-1 border-none border-t border-[var(--stitch)]" />
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-[var(--fabric-red)]/10 text-[var(--fabric-red)] border border-[var(--fabric-red)]/20 rounded-[6px] text-sm text-center">
              {error}
            </div>
          )}

        <div className="flex flex-col gap-1.5">
          <ChalkLabel htmlFor="shopName">Shop Name</ChalkLabel>
          <input
            id="shopName"
            name="shopName"
            type="text"
            placeholder="e.g. Master Tailors"
            required
            disabled={isPending}
            className="w-full h-[46px] px-[14px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <ChalkLabel htmlFor="ownerName">Your Name</ChalkLabel>
          <input
            id="ownerName"
            name="ownerName"
            type="text"
            placeholder="e.g. Sujal Patel"
            required
            disabled={isPending}
            className="w-full h-[46px] px-[14px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <ChalkLabel htmlFor="city">City</ChalkLabel>
            <input
              id="city"
              name="city"
              type="text"
              placeholder="Mumbai"
              required
              disabled={isPending}
              className="w-full h-[46px] px-[14px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <ChalkLabel htmlFor="mobile">Mobile</ChalkLabel>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="9876543210"
              required
              disabled={isPending}
              className="w-full h-[46px] px-[14px] bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
            />
          </div>
        </div>

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
          <ChalkLabel htmlFor="password">Password</ChalkLabel>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={6}
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
          Set up my atelier
        </ThreadButton>
      </form>
      </div>

      <div className="w-full mt-8 flex flex-col items-center gap-6">
        <MeasureDivider />
        <Link href="/auth/login" className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] hover:text-[var(--thread-gold)] transition-colors">
          Already have an account? Sign in &rarr;
        </Link>
      </div>
    </FabricCard>
  );
}
