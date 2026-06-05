import React from 'react';
import { cn } from "@/lib/utils";

interface ThreadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  isLoading?: boolean;
}

export const ThreadButton = React.forwardRef<HTMLButtonElement, ThreadButtonProps>(
  ({ className, variant = 'primary', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "relative flex items-center justify-center gap-2 rounded-[6px] px-[24px] py-[10px] text-[clamp(12px,2.5vw,14px)] tracking-[0.04em] transition-all duration-200",
          "font-[family-name:var(--font-sans)]",
          "active:translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none",
          variant === 'primary' 
            ? "bg-[var(--ink-dark)] text-[var(--bg-parchment)] border border-[var(--ink-dark)] hover:bg-[var(--bg-deep)]"
            : "bg-transparent text-[var(--ink-dark)] border border-[var(--ink-dark)] hover:bg-[var(--bg-surface)]",
          className
        )}
        {...props}
      >
        {isLoading && (
          <div className="w-[14px] h-[14px] rounded-full border-[2px] border-dashed border-current animate-[spin_3s_linear_infinite] opacity-70"></div>
        )}
        {children}
      </button>
    );
  }
);
ThreadButton.displayName = "ThreadButton";
