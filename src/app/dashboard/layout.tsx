import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Scissors, Home, PlusCircle, History, Settings, LogOut } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

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

  const shopName = shop?.shop_name || "My Shop";

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Scissors className="h-5 w-5 text-primary" />
              <span className="text-primary">FitLook</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4 gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <PlusCircle className="h-4 w-4" />
                New Trial
              </Link>
              <Link
                href="/dashboard/history"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <History className="h-4 w-4" />
                History
              </Link>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Topbar */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 justify-between md:justify-end">
          <div className="flex items-center gap-2 md:hidden">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">FitLook</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-foreground">{shopName}</span>
            <form action={logout}>
              <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
