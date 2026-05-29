import React from 'react';
import { cn } from "@/lib/utils";

interface ChalkLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  withDash?: boolean;
}

export function ChalkLabel({ className, children, withDash = false, ...props }: ChalkLabelProps) {
  return (
    <label 
      className={cn(
        "flex items-center text-[11px] uppercase tracking-[0.1em] text-[var(--ink-light)] font-[family-name:var(--font-sans)] font-light",
        className
      )}
      {...props}
    >
      {withDash && <span className="w-[12px] h-[1px] bg-[var(--ink-light)] mr-2 opacity-50"></span>}
      {children}
    </label>
  );
}
