"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";
import { Loader2 } from "lucide-react";

interface GoldButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "ghost";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ children, className, variant = "primary", isLoading, ...props }, ref) => {
    const baseStyles = "relative overflow-hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 px-4 py-2";
    
    const primaryStyles = "bg-gold text-deep hover:bg-gold/90 shadow-[var(--glow-gold)]";
    const ghostStyles = "bg-transparent border border-gold text-gold hover:bg-gold-muted";

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          baseStyles,
          variant === "primary" ? primaryStyles : ghostStyles,
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
GoldButton.displayName = "GoldButton";
