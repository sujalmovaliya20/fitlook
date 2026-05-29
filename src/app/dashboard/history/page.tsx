import { createClient } from "@/utils/supabase/server";
import { HistoryClient } from "./HistoryClient";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch all trials for this user's shop
  const { data: trials, error } = await supabase
    .from("trials")
    .select("*")
    .eq("shop_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trials:", error);
  }

  // Calculate completed this month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  
  const completedThisMonth = (trials || []).filter(t => 
    t.status === "generated" && t.created_at >= firstDayOfMonth
  ).length;

  return (
    <HistoryClient 
      initialTrials={trials || []} 
      totalCompleted={completedThisMonth} 
    />
  );
}
