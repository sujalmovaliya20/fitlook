"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface LivePreviewProps {
  fabricPreview: string | null;
  customerPreview: string | null;
  garmentType: string;
}

export function LivePreview({ fabricPreview, customerPreview, garmentType }: LivePreviewProps) {
  return (
    <div className="w-full h-[600px] bg-[#0E0E15] rounded-[24px] border border-[rgba(255,255,255,0.05)] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-gold)] rounded-full blur-[120px] opacity-[0.05] pointer-events-none" />
      
      {!fabricPreview && !customerPreview && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-dashed border-[rgba(255,255,255,0.1)] mx-auto mb-4 flex items-center justify-center">
            <span className="text-[clamp(18px,4.5vw,24px)] opacity-20">✨</span>
          </div>
          <p className="text-[clamp(12px,2.5vw,14px)] text-[var(--text-muted)] font-[family-name:var(--font-body)]">Preview will appear here</p>
        </div>
      )}

      <AnimatePresence>
        {(fabricPreview || customerPreview) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full relative flex flex-col"
          >
            {/* Before AI Label */}
            {(fabricPreview && customerPreview) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 right-4 z-20 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 backdrop-blur-md px-3 py-1 rounded-full text-[clamp(10px,2vw,12px)] font-bold text-[var(--accent-gold)] uppercase tracking-wider"
              >
                Before AI
              </motion.div>
            )}

            <div className="flex-1 flex gap-2 relative">
              {/* Customer Image (Left if both present, center if alone) */}
              <AnimatePresence>
                {customerPreview && (
                  <motion.div
                    key="customer"
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className={`relative rounded-[16px] overflow-hidden border border-[rgba(255,255,255,0.1)] ${fabricPreview ? 'w-2/3 h-full' : 'w-full h-full'}`}
                  >
                    <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={customerPreview} alt="Customer" fill className="object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fabric Image */}
              <AnimatePresence>
                {fabricPreview && (
                  <motion.div
                    key="fabric"
                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className={`relative rounded-[16px] overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-xl ${customerPreview ? 'w-1/3 h-2/3 mt-auto' : 'w-full h-full'}`}
                  >
                    <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={fabricPreview} alt="Fabric" fill className="object-cover" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Garment Type Overlay */}
            <AnimatePresence>
              {garmentType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 z-20 bg-[var(--bg-deep)]/80 backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-[12px] p-4 text-center"
                >
                  <span className="text-[clamp(10px,2vw,12px)] text-[var(--text-muted)] uppercase tracking-wider block mb-1">Rendering as</span>
                  <span className="text-[clamp(14px,3vw,16px)] font-[family-name:var(--font-display)] text-[var(--accent-gold)]">{garmentType}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
