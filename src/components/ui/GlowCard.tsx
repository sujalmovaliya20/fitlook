"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "gold" | "red" | "teal" | "none";
}

export function GlowCard({ children, className, glowColor = "gold" }: GlowCardProps) {
  const glowClass = 
    glowColor === "gold" ? "hover:shadow-[var(--glow-gold)]" : 
    glowColor === "red" ? "hover:shadow-[var(--glow-red)]" : 
    glowColor === "teal" ? "hover:shadow-[var(--glow-teal)]" : "";

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] transition-colors duration-300",
        glowClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
