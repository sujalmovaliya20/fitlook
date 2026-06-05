"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check visits
    const visits = parseInt(localStorage.getItem("fitlook_visits") || "0") + 1;
    localStorage.setItem("fitlook_visits", visits.toString());

    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Only show prompt if visits >= 3
      if (visits >= 3) {
        setShowPrompt(true);
      }
    });

    window.addEventListener("appinstalled", () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-[var(--bg-card)] border border-[var(--accent-border)] shadow-2xl rounded-xl p-5 z-[100] flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5">
      <div>
        <h4 className="font-[family-name:var(--font-heading)] font-semibold text-lg text-[var(--text-primary)]">Install FitLook</h4>
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--text-muted)] mt-1">Add to home screen for faster access.</p>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => setShowPrompt(false)}
          className="font-[family-name:var(--font-body)] text-sm font-medium px-4 py-2 border border-[var(--accent-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors"
        >
          Later
        </button>
        <button 
          onClick={handleInstallClick}
          className="font-[family-name:var(--font-body)] text-sm font-semibold px-4 py-2 bg-[var(--accent-gold)] text-[var(--text-inverse)] hover:bg-[var(--accent-gold-light)] rounded-lg shadow-sm transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  );
}
