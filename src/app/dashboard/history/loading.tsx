import { HistoryFilters } from "./filters";

export default function HistoryLoading() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[32px] font-medium text-[var(--text-primary)] mb-2">Trial History</h1>
        <p className="text-[15px] text-[var(--text-secondary)] font-light">View and manage past customer virtual trials.</p>
      </div>

      {/* Mock Filters */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-24 h-10 rounded-full skeleton-shimmer" />
        ))}
      </div>
      
      {/* Skeleton List */}
      <div className="flex flex-col gap-3">
        <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_100px] px-6 py-3">
          <div className="w-20 h-4 rounded skeleton-shimmer" />
          <div className="w-24 h-4 rounded skeleton-shimmer" />
          <div className="w-24 h-4 rounded skeleton-shimmer" />
          <div className="w-16 h-4 rounded skeleton-shimmer" />
          <div className="w-16 h-4 rounded skeleton-shimmer ml-auto" />
        </div>

        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] p-4 md:px-6 md:py-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_100px] items-center gap-4 md:gap-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-[10px] skeleton-shimmer" />
                <div className="w-32 h-5 rounded skeleton-shimmer" />
              </div>
              <div className="w-24 h-4 rounded skeleton-shimmer" />
              <div className="w-28 h-4 rounded skeleton-shimmer" />
              <div className="w-20 h-4 rounded skeleton-shimmer" />
              <div className="w-20 h-6 rounded-full skeleton-shimmer md:ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
