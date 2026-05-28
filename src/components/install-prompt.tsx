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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-card border shadow-lg rounded-xl p-4 z-50 flex items-center justify-between gap-4">
      <div>
        <h4 className="font-semibold text-sm">Install FitLook App</h4>
        <p className="text-xs text-muted-foreground">Add to home screen for faster access.</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setShowPrompt(false)}>Later</Button>
        <Button size="sm" onClick={handleInstallClick}>Install</Button>
      </div>
    </div>
  );
}
