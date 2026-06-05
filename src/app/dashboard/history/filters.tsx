"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const statuses = [
  { label: "All", value: "all" },
  { label: "Generated", value: "generated" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
];

export function HistoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "all";

  const [searchQuery, setSearchQuery] = useState(currentSearch);

  const updateFilters = (search: string, status: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    updateFilters(val, currentStatus);
  };

  const handleStatusChange = (val: string) => {
    updateFilters(searchQuery, val);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-[var(--bg-card)] p-4 rounded-[var(--radius-lg)] border border-[var(--border-subtle)]">
      {/* Search Bar */}
      <div className="relative w-full sm:w-full max-w-[320px] h-[48px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
        <input
          type="search"
          placeholder="Search by customer name..."
          className="w-full h-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[10px] pl-12 pr-4 outline-none text-[clamp(14px,3vw,16px)] font-[family-name:var(--font-body)] font-normal text-[var(--text-primary)] transition-all duration-300 focus:border-[var(--accent-gold)] focus:shadow-[var(--glow-gold)]"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            className={cn(
              "px-5 py-2.5 rounded-full text-[clamp(12px,2.5vw,14px)] font-medium transition-all duration-300 whitespace-nowrap",
              currentStatus === status.value
                ? "bg-[rgba(201,168,76,0.15)] text-[var(--accent-gold)] shadow-[var(--glow-gold)]"
                : "bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--text-primary)] border border-[rgba(255,255,255,0.05)]"
            )}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  );
}
