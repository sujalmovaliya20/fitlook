import React from 'react';
import { cn } from "@/lib/utils";

interface MeasurementBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MeasurementBadge({ value, unit, size = 'md', className, ...props }: MeasurementBadgeProps) {
  const sizeClasses = {
    sm: "text-[16px]",
    md: "text-[24px]",
    lg: "text-[36px]",
    xl: "text-[48px]",
  };

  return (
    <span 
      className={cn(
        "font-[family-name:var(--font-mono)] text-[var(--thread-gold)] border-b border-[var(--thread-muted)] pb-[2px]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {value}
      {unit && <span className="text-[0.6em] ml-1 opacity-70">{unit}</span>}
    </span>
  );
}
