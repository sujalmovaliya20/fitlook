"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, type, className, required, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;
    
    // Label should float if focused OR if there's a value (we use standard defaultValue or value check,
    // but easiest is to let CSS peer-focus/peer-placeholder-shown handle it if we don't control the component,
    // however since we want to animate with framer-motion or just CSS, we can use CSS `peer` classes).
    
    return (
      <div className={cn("relative w-full h-[52px]", className)}>
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "peer w-full h-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]",
            "rounded-[10px] px-4 pt-4 pb-1 outline-none text-[15px] font-[family-name:var(--font-body)] font-normal text-[var(--text-primary)]",
            "transition-all duration-300",
            "focus:border-[var(--accent-gold)] focus:shadow-[var(--glow-gold)]"
          )}
          placeholder=" "
          onFocus={(e) => {
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            props.onBlur?.(e);
          }}
          onChange={(e) => {
            props.onChange?.(e);
          }}
          required={required}
          {...props}
        />
        <label
          className={cn(
            "absolute left-4 text-[var(--text-secondary)] font-[family-name:var(--font-body)] transition-all duration-300 pointer-events-none",
            "top-1/2 -translate-y-1/2 text-[15px]",
            "peer-focus:top-3 peer-focus:-translate-y-1/2 peer-focus:text-[11px] peer-focus:text-[var(--accent-gold)]",
            "peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:text-[11px]"
          )}
        >
          {label} {required && <span className="text-[var(--accent-red)]">*</span>}
        </label>

        {isPassword && (
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--accent-gold)] hover:opacity-80 transition-opacity"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";
