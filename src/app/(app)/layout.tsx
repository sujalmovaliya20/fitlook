import { AtelierSidebar } from "@/components/layout/AtelierSidebar";
import { AtelierTopbar } from "@/components/layout/AtelierTopbar";
import { AtelierBottomNav } from "@/components/layout/AtelierBottomNav";
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-parchment)] relative">
      <AtelierSidebar />
      <div className="pl-0 md:pl-[240px] flex flex-col min-h-screen pb-[64px] md:pb-0">
        <AtelierTopbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <AtelierBottomNav />
    </div>
  );
}
