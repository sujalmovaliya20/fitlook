"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Trial {
  id: string;
  customer_name: string;
  fabric_type?: string;
  garment_type: string;
  status: string;
  created_at: string;
  fabric_image_url?: string;
  result_image_url?: string;
}

export function HistoryList({ trials }: { trials: Trial[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!trials || trials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] text-center min-h-[400px]">
        {/* Abstract CSS Shapes for Empty State */}
        <div className="relative w-32 h-32 mb-8 opacity-60">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-gold-muted)] rounded-full border border-[var(--accent-gold)]/30" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-[var(--bg-deep)] rounded-lg border border-[var(--border-subtle)] transform rotate-12" />
        </div>
        <h3 className="text-xl font-[family-name:var(--font-display)] text-[var(--accent-gold)] tracking-wide mb-2">No trials found.</h3>
        <p className="text-[var(--text-secondary)] text-[14px]">Your generated trials will appear here.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-[rgba(31,200,120,0.1)] text-[#1FC878] border-[#1FC878]/20";
      case "pending":
      case "processing":
        return "bg-[rgba(201,168,76,0.1)] text-[var(--accent-gold)] border-[var(--accent-gold)]/20";
      case "failed":
        return "bg-[rgba(233,69,96,0.1)] text-[var(--accent-red)] border-[var(--accent-red)]/20";
      default:
        return "bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border-[rgba(255,255,255,0.1)]";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header Row */}
      <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_100px] px-6 py-3 text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
        <div>Customer</div>
        <div>Fabric Type</div>
        <div>Garment Type</div>
        <div>Date</div>
        <div className="text-right">Status</div>
      </div>

      {trials.map((trial) => {
        const isExpanded = expandedId === trial.id;
        
        return (
          <motion.div
            key={trial.id}
            layout
            className={cn(
              "bg-[var(--bg-card)] rounded-[var(--radius-lg)] border transition-all duration-300 overflow-hidden cursor-pointer",
              isExpanded 
                ? "border-[var(--border-accent)] shadow-[var(--glow-gold)]" 
                : "border-[var(--border-subtle)] hover:bg-[var(--bg-card-hover)] hover:border-l-[3px] hover:border-l-[var(--accent-gold)]"
            )}
            onClick={() => setExpandedId(isExpanded ? null : trial.id)}
          >
            {/* Row Content */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_100px] items-center p-4 md:px-6 md:py-4 gap-4 md:gap-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[10px] overflow-hidden bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] relative flex-shrink-0">
                  {trial.fabric_image_url ? (
                    <Image src={trial.fabric_image_url} alt="Fabric" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--text-muted)]">No img</div>
                  )}
                </div>
                <span className="font-medium text-[var(--text-primary)] text-[15px]">{trial.customer_name}</span>
              </div>
              <div className="text-[14px] text-[var(--text-secondary)]">
                <span className="md:hidden text-[var(--text-muted)] text-[12px] uppercase mr-2">Fabric:</span>
                {trial.fabric_type || "N/A"}
              </div>
              <div className="text-[14px] text-[var(--text-secondary)] capitalize">
                <span className="md:hidden text-[var(--text-muted)] text-[12px] uppercase mr-2">Garment:</span>
                {trial.garment_type}
              </div>
              <div className="text-[14px] text-[var(--text-secondary)]">
                <span className="md:hidden text-[var(--text-muted)] text-[12px] uppercase mr-2">Date:</span>
                {new Date(trial.created_at).toLocaleDateString()}
              </div>
              <div className="md:text-right">
                <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider border", getStatusBadge(trial.status))}>
                  {trial.status}
                </span>
              </div>
            </div>

            {/* Expanded Preview */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="border-t border-[var(--border-subtle)] bg-[#111118]/50"
                >
                  <div className="p-6 md:px-12 md:py-8 flex flex-col md:flex-row gap-8 items-center justify-center">
                    {trial.result_image_url ? (
                      <div className="relative w-full max-w-[300px] aspect-[3/4] rounded-[16px] overflow-hidden border border-[var(--border-subtle)] shadow-2xl">
                        <Image src={trial.result_image_url} alt="Result" fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-full max-w-[300px] aspect-[3/4] rounded-[16px] border border-dashed border-[var(--border-subtle)] flex flex-col items-center justify-center text-center p-6 text-[var(--text-secondary)] bg-[rgba(255,255,255,0.01)]">
                        {trial.status === "failed" ? "Generation failed. Please try again." : "Result image is not available yet."}
                      </div>
                    )}
                    
                    {trial.result_image_url && (
                      <div className="flex flex-col gap-4">
                        <a href={trial.result_image_url} download className="px-6 py-3 rounded-full border border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold-muted)] transition-colors text-[14px] font-medium inline-block text-center">
                          Download Image
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
