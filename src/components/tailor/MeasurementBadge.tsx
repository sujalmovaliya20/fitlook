import React from 'react';
import { cn } from "@/lib/utils";

interface MeasurementBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string | number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function MeasurementBadge({ value, unit, size = 'md', className, ...props }: MeasurementBadgeProps) {
  const sizeClasses = {
    sm: "text-[clamp(14px,3vw,16px)]",
    md: "text-[clamp(18px,4.5vw,24px)]",
    lg: "text-[clamp(22px,6vw,36px)]",
    xl: "text-[clamp(24px,7vw,48px)]",
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
