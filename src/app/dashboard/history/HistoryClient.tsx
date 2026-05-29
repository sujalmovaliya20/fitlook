"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

import { FabricCard } from "@/components/tailor/FabricCard";
import { ChalkLabel } from "@/components/tailor/ChalkLabel";
import { ThreadButton } from "@/components/tailor/ThreadButton";
import { MeasurementBadge } from "@/components/tailor/MeasurementBadge";
import { MeasureDivider } from "@/components/tailor/MeasureDivider";

interface Trial {
  id: string;
  customer_name: string;
  fabric_type?: string;
  garment_type: string;
  status: string;
  created_at: string;
  fabric_image_url?: string;
  result_image_url?: string;
  instructions?: string;
}

export function HistoryClient({ initialTrials, totalCompleted }: { initialTrials: Trial[], totalCompleted: number }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const itemsPerPage = 8;

  const filteredTrials = useMemo(() => {
    return initialTrials.filter((trial) => {
      const matchesSearch = trial.customer_name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || trial.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialTrials, search, statusFilter]);

  const totalPages = Math.ceil(filteredTrials.length / itemsPerPage) || 1;
  const paginatedTrials = filteredTrials.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabClick = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setExpandedId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return (
          <span className="inline-block bg-[rgba(26,92,92,0.1)] text-[var(--fabric-teal)] font-[family-name:var(--font-sans)] font-light text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--fabric-teal)]/20">
            ✓ Stitched
          </span>
        );
      case "pending":
      case "processing":
        return (
          <span className="inline-block bg-[var(--thread-muted)] text-[var(--thread-gold)] font-[family-name:var(--font-sans)] font-light text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--thread-gold)]/20">
            ⧗ In progress
          </span>
        );
      case "failed":
        return (
          <span className="inline-block bg-[rgba(139,26,26,0.08)] text-[var(--fabric-red)] font-[family-name:var(--font-sans)] font-light text-[11px] px-2.5 py-0.5 rounded-full border border-[var(--fabric-red)]/20">
            ✗ Retry needed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 mt-4">
      
      {/* PAGE HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-[28px] text-[var(--ink-dark)] mb-1 leading-none">Order Register</h1>
          <p className="font-[family-name:var(--font-sans)] font-light text-[13px] text-[var(--ink-mid)]">{totalCompleted} trials completed this month</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-[family-name:var(--font-sans)] font-light text-[10px] text-[var(--ink-faint)] uppercase tracking-widest">Total Orders</span>
          <div className="font-[family-name:var(--font-mono)] text-[32px] font-light text-[var(--thread-gold)] leading-none" style={{ textShadow: '0 1px 2px rgba(201,168,76,0.2)' }}>
            {initialTrials.length.toString().padStart(3, '0')}
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="relative w-full md:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-faint)]" />
          <input 
            type="text"
            placeholder="Search by customer name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full h-[40px] pl-9 pr-3 bg-[var(--bg-surface)] border border-[var(--stitch)] rounded-[6px] font-[family-name:var(--font-sans)] text-[13px] text-[var(--ink-dark)] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--thread-gold)] focus:bg-[var(--bg-warm-white)] transition-all duration-200"
          />
        </div>

        <div className="flex gap-6 border-b border-[var(--stitch)]">
          {[
            { id: "all", label: "All Orders" },
            { id: "generated", label: "Completed" },
            { id: "pending", label: "Pending" },
            { id: "failed", label: "Failed" },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "pb-2 font-[family-name:var(--font-sans)] text-[12px] transition-colors relative",
                  isActive 
                    ? "text-[var(--ink-dark)] font-normal border-b-2 border-[var(--thread-gold)]" 
                    : "text-[var(--ink-light)] font-light border-b-2 border-transparent hover:text-[var(--ink-mid)]"
                )}
                style={{ marginBottom: '-1px' }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* REGISTER TABLE */}
      <FabricCard className="p-0 overflow-hidden min-h-[400px] flex flex-col">
        {/* Column Headers */}
        <div className="grid grid-cols-[80px_60px_1fr_100px_120px] px-6 pt-6 pb-2 items-end">
          <ChalkLabel className="!text-[10px]">Order</ChalkLabel>
          <ChalkLabel className="!text-[10px]">Fabric</ChalkLabel>
          <ChalkLabel className="!text-[10px]">Customer & Cut</ChalkLabel>
          <ChalkLabel className="!text-[10px]">Date</ChalkLabel>
          <ChalkLabel className="!text-[10px] text-right">Status</ChalkLabel>
        </div>
        <div className="px-6 mb-2">
          <div className="w-full h-[1px] bg-[var(--stitch-strong)]" />
        </div>

        {paginatedTrials.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            {/* Open book CSS illustration */}
            <div className="relative w-[60px] h-[40px] mb-6 opacity-60">
              <div className="absolute top-0 right-1/2 w-[28px] h-[36px] border border-[var(--ink-faint)] rounded-[2px_6px_6px_2px] bg-[var(--bg-parchment)] transform skew-y-6 origin-right" />
              <div className="absolute top-0 left-1/2 w-[28px] h-[36px] border border-[var(--ink-faint)] rounded-[6px_2px_2px_6px] bg-[var(--bg-parchment)] transform -skew-y-6 origin-left" />
              {/* pages lines */}
              <div className="absolute top-2 right-[55%] w-[16px] h-[1px] bg-[var(--stitch)] transform skew-y-6" />
              <div className="absolute top-4 right-[55%] w-[20px] h-[1px] bg-[var(--stitch)] transform skew-y-6" />
              <div className="absolute top-2 left-[55%] w-[16px] h-[1px] bg-[var(--stitch)] transform -skew-y-6" />
              <div className="absolute top-4 left-[55%] w-[20px] h-[1px] bg-[var(--stitch)] transform -skew-y-6" />
            </div>
            
            <h3 className="font-[family-name:var(--font-serif)] italic text-[18px] text-[var(--ink-light)] mb-1">Your register is empty.</h3>
            <p className="font-[family-name:var(--font-sans)] font-light text-[13px] text-[var(--ink-faint)] mb-6">Your first trial will appear here.</p>
            <ThreadButton variant="ghost" onClick={() => window.location.href='/dashboard/new-trial'}>Start a trial &rarr;</ThreadButton>
          </div>
        ) : (
          <div className="flex flex-col flex-1 pb-4">
            {paginatedTrials.map((trial, index) => {
              const isExpanded = expandedId === trial.id;
              const isLast = index === paginatedTrials.length - 1;
              const dateObj = new Date(trial.created_at);
              const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'short' })}`;
              const shortId = trial.id.substring(0, 6).toUpperCase();

              return (
                <div key={trial.id} className="flex flex-col">
                  {/* ROW */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : trial.id)}
                    className={cn(
                      "group grid grid-cols-[80px_60px_1fr_100px_120px] items-center min-h-[64px] px-6 py-3 cursor-pointer transition-colors relative border-l-[3px]",
                      isExpanded ? "bg-[var(--bg-surface)] border-l-[var(--thread-gold)]" : "border-l-transparent hover:bg-[var(--bg-surface)] hover:border-l-[var(--thread-gold)]",
                      !isLast && !isExpanded ? "border-b border-dashed border-[var(--stitch)] mx-6 w-[calc(100%-48px)] px-0" : ""
                    )}
                  >
                    {/* View Right Hover */}
                    <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity font-[family-name:var(--font-sans)] font-light text-[12px] text-[var(--ink-mid)] pointer-events-none">
                      View &rarr;
                    </div>

                    <div className="font-[family-name:var(--font-mono)] font-light text-[11px] text-[var(--ink-faint)] uppercase tracking-wider">
                      TRL-{shortId}
                    </div>
                    
                    <div className="w-[40px] h-[40px] rounded-[4px] overflow-hidden bg-[var(--stitch)] border border-[var(--stitch-strong)] relative">
                      {trial.fabric_image_url ? (
                        <Image src={trial.fabric_image_url} alt="Fabric" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, var(--fabric-teal), var(--thread-saffron))', opacity: 0.8 }} />
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <span className="font-[family-name:var(--font-sans)] font-normal text-[14px] text-[var(--ink-dark)]">{trial.customer_name || "Walk-in Customer"}</span>
                      <span className="font-[family-name:var(--font-sans)] font-light text-[11px] text-[var(--ink-light)] capitalize">{trial.garment_type.replace(/-/g, ' ')}</span>
                    </div>
                    
                    <div className="font-[family-name:var(--font-mono)] font-light text-[12px] text-[var(--ink-mid)]">
                      {formattedDate}
                    </div>
                    
                    <div className="text-right group-hover:opacity-0 transition-opacity">
                      {getStatusBadge(trial.status)}
                    </div>
                  </div>

                  {/* EXPANDED INLINE DETAILS */}
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out bg-[var(--bg-surface)] px-6 w-full",
                      isExpanded ? "max-h-[800px] border-b border-dashed border-[var(--stitch)] pb-6 pt-2" : "max-h-0 border-b border-transparent"
                    )}
                  >
                    <div className="pl-[140px] flex gap-8 opacity-100">
                      {trial.result_image_url ? (
                        <div className="w-[120px] aspect-[3/4] rounded-[6px] overflow-hidden border border-[var(--stitch)] relative shadow-sm">
                          <Image src={trial.result_image_url} alt="Result" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-[120px] aspect-[3/4] rounded-[6px] border border-dashed border-[var(--stitch-strong)] flex items-center justify-center text-center p-2">
                          <span className="font-[family-name:var(--font-sans)] font-light text-[10px] text-[var(--ink-faint)]">
                            {trial.status === 'failed' ? "Failed" : "Processing"}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-4 max-w-sm pt-2">
                        <div>
                          <ChalkLabel className="mb-0.5">Style Notes</ChalkLabel>
                          <p className="font-[family-name:var(--font-sans)] font-light text-[13px] text-[var(--ink-mid)] italic">
                            {trial.instructions || "No notes provided for this stitch."}
                          </p>
                        </div>
                        {trial.result_image_url && (
                          <div>
                            <ThreadButton variant="ghost" className="!h-8 !px-0" onClick={() => window.open(trial.result_image_url, '_blank')}>
                              View Full Result &rarr;
                            </ThreadButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </FabricCard>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-[var(--stitch)]">
          <ThreadButton 
            variant="ghost" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            &larr; Prev
          </ThreadButton>
          <span className="font-[family-name:var(--font-mono)] font-light text-[12px] text-[var(--ink-light)]">
            Page {currentPage} of {totalPages}
          </span>
          <ThreadButton 
            variant="ghost" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next &rarr;
          </ThreadButton>
        </div>
      )}
    </div>
  );
}
