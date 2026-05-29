import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

export function MeasureDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center w-full h-[20px] opacity-70", className)}>
      <div className="flex-1 border-t border-dashed border-[var(--ink-faint)]"></div>
      <div className="mx-3 text-[var(--ink-light)]">
        <Scissors className="w-[14px] h-[14px]" />
      </div>
      <div className="flex-1 border-t border-dashed border-[var(--ink-faint)]"></div>
    </div>
  );
}
