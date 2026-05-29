import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AtelierSidebar } from "@/components/layout/AtelierSidebar";
import { AtelierTopbar } from "@/components/layout/AtelierTopbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch shop data
  const { data: shop } = await supabase
    .from("shops")
    .select("shop_name, owner_name")
    .eq("id", user.id)
    .single();

  const shopName = shop?.shop_name || "My Atelier";

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
