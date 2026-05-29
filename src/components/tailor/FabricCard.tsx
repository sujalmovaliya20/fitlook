import React from 'react';
import { cn } from "@/lib/utils";

interface FabricCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FabricCard({ className, children, ...props }: FabricCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-[var(--bg-card)] rounded-[12px] p-[20px_24px] border border-[var(--stitch)] transition-all duration-200",
        "hover:border-[var(--thread-gold)] hover:shadow-[2px_2px_0px_var(--fabric-cream)]",
        className
      )}
      {...props}
    >
      {/* Chalk corner mark top-left */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-[2px] border-l-[2px] border-[var(--ink-faint)] opacity-60 rounded-tl-[1px] pointer-events-none"></div>
      
      {children}
    </div>
  );
}
