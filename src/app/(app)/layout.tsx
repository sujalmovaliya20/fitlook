import { AtelierSidebar } from "@/components/layout/AtelierSidebar";
import { AtelierTopbar } from "@/components/layout/AtelierTopbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-parchment)] relative">
      <AtelierSidebar />
      <div className="pl-[240px] flex flex-col min-h-screen">
        <AtelierTopbar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
