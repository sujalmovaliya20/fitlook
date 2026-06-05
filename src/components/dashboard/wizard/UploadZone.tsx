"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface UploadZoneProps {
  type: "fabric" | "customer";
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  icon: React.ReactNode;
  headline: string;
  subtext: string;
}

export function UploadZone({ type, previewUrl, onFileSelect, icon, headline, subtext }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="relative w-full h-[400px]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative rounded-2xl overflow-hidden border-2 border-[var(--accent-gold)] group"
          >
            <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" src={previewUrl} alt={`${type} preview`} fill className="object-cover" />
            
            {/* Success Overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-[var(--bg-deep)]/90 backdrop-blur-md px-6 py-3 rounded-full border border-[var(--accent-gold)] flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[var(--accent-gold)]" />
                <span className="text-[var(--accent-gold)] font-medium text-[clamp(14px,3vw,16px)]">
                  {type === "fabric" ? "Fabric captured" : "Customer captured"}
                </span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-[clamp(12px,2.5vw,14px)] text-white hover:text-[var(--accent-gold)] transition-colors bg-white/10 px-4 py-2 rounded-full"
              >
                <RefreshCw className="w-4 h-4" /> Change Image
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            className={cn(
              "w-full h-full rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden",
              isDragActive 
                ? "bg-[rgba(201,168,76,0.1)] border-2 border-solid border-[var(--accent-gold)] shadow-[var(--glow-gold)]"
                : "bg-[rgba(201,168,76,0.03)] border-2 border-dashed border-[rgba(201,168,76,0.2)] hover:border-solid hover:border-[var(--accent-gold)] hover:bg-[rgba(201,168,76,0.06)]"
            )}
          >
            {isDragActive && (
              <div className="absolute inset-0 bg-[var(--accent-gold)]/5 animate-pulse" />
            )}
            <div className="relative z-10 flex flex-col items-center text-center p-6">
              <div className="mb-6">
                {icon}
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-[clamp(20px,5vw,30px)] text-[var(--text-primary)] mb-2">
                {headline}
              </h3>
              <p className="text-[clamp(14px,3vw,16px)] font-[family-name:var(--font-body)] text-[var(--text-secondary)] mb-6 max-w-sm">
                {subtext}
              </p>
              <span className="text-[clamp(10px,2vw,12px)] text-[var(--text-muted)] uppercase tracking-wider font-medium">
                Accepts JPG, PNG, WEBP (Max 10MB)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
