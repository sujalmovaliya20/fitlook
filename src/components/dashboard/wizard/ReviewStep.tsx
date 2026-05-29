"use client";

import { GlowCard } from "@/components/ui/GlowCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface ReviewStepProps {
  fabricPreview: string | null;
  customerPreview: string | null;
  customerName: string;
  garmentType: string;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function ReviewStep({
  fabricPreview,
  customerPreview,
  customerName,
  garmentType,
  isGenerating,
  onGenerate,
}: ReviewStepProps) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-[24px] text-[var(--text-primary)] mb-2">Review & Generate</h2>
        <p className="text-[14px] text-[var(--text-secondary)]">Confirm the details below before our AI starts stitching.</p>
      </div>

      <GlowCard glowColor="gold" className="p-1">
        <div className="flex flex-col md:flex-row h-full rounded-[var(--radius-lg)] overflow-hidden bg-[var(--bg-card)]">
          {/* Images 50/50 */}
          <div className="w-full md:w-1/2 flex h-[300px] md:h-[400px]">
            <div className="w-1/2 h-full relative border-r border-[rgba(255,255,255,0.05)]">
              {fabricPreview && <Image src={fabricPreview} alt="Fabric" fill className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-[12px] font-medium text-white uppercase tracking-wider">Fabric</span>
              </div>
            </div>
            <div className="w-1/2 h-full relative">
              {customerPreview && <Image src={customerPreview} alt="Customer" fill className="object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-[12px] font-medium text-white uppercase tracking-wider">Customer</span>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <span className="text-[12px] text-[var(--text-muted)] uppercase tracking-wider font-medium mb-1 block">Customer</span>
                <p className="text-[20px] text-[var(--text-primary)] font-[family-name:var(--font-display)]">{customerName || "Walk-in Customer"}</p>
              </div>
              <div>
                <span className="text-[12px] text-[var(--text-muted)] uppercase tracking-wider font-medium mb-1 block">Garment Style</span>
                <p className="text-[20px] text-[var(--accent-gold)] font-[family-name:var(--font-display)]">{garmentType}</p>
              </div>
            </div>
          </div>
        </div>
      </GlowCard>

      <div className="pt-4 flex justify-center">
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.button
              key="generate-btn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGenerate}
              className="relative w-full max-w-md h-[64px] rounded-[14px] bg-[linear-gradient(135deg,#C9A84C,#E5B96A)] overflow-hidden shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.5)] transition-shadow flex items-center justify-center gap-3"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer" />
              
              <span className="relative z-10 text-[18px] font-bold text-[#1A1A2E]">Generate AI Trial</span>
              <ArrowRight className="relative z-10 w-5 h-5 text-[#1A1A2E]" />
            </motion.button>
          ) : (
            <motion.div
              key="processing-btn"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md h-[64px] rounded-[14px] bg-[rgba(201,168,76,0.1)] border border-[var(--accent-gold)] flex items-center justify-center gap-3"
            >
              <Loader2 className="w-5 h-5 text-[var(--accent-gold)] animate-spin" />
              <span className="text-[18px] font-medium text-[var(--accent-gold)]">Initializing Engine...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
