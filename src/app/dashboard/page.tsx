import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FabricCard } from "@/components/tailor/FabricCard";
import { MeasureDivider } from "@/components/tailor/MeasureDivider";

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let todayCount = 0;
  let monthCount = 0;
  let ownerName = "Shop Owner";
  let city = "Add your city";

  if (user) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const { count: cToday, error: errToday } = await supabase
      .from("trials")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", user.id)
      .gte("created_at", today.toISOString());

    const { count: cMonth, error: errMonth } = await supabase
      .from("trials")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", user.id)
      .gte("created_at", firstDayOfMonth.toISOString());

    const { data: shopData } = await supabase
      .from("shops")
      .select("owner_name, city")
      .eq("id", user.id)
      .single();

    if (!errToday && cToday !== null) todayCount = cToday;
    if (!errMonth && cMonth !== null) monthCount = cMonth;
    if (shopData?.owner_name) {
      ownerName = shopData.owner_name.split(" ")[0]; // Get first name
    }
    if (shopData?.city) {
      city = shopData.city;
    }
  }

  // Determine greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Date formatting (Indian format)
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-IN', dateOptions).format(new Date());

  // Mock trials for today
  const todayTrials: any[] = []; // empty state

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 mt-4">
      
      {/* GREETING SECTION */}
      <div className="relative">
        <h3 className="section-label">Today's Atelier</h3>
        <h1 className="greeting-text mb-1">
          {greeting}, {ownerName}.
        </h1>
        <p className="date-text">
          {formattedDate} &nbsp;&mdash;&nbsp; {city}
        </p>

        {/* Decorative Needle & Thread */}
        <div className="absolute right-0 top-0 w-24 h-24 pointer-events-none opacity-40">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 20 L20 80" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" />
            <path d="M75 15 L85 25" stroke="var(--ink-faint)" strokeWidth="2" strokeLinecap="round" />
            <path d="M83 23 C 90 30, 90 40, 70 50 C 50 60, 50 70, 60 90" stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="4 4" fill="none" />
          </svg>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="stat-card-container flex flex-col">
          <p className="stat-card-label">Trials Today</p>
          <p className="stat-card-number">{todayCount}</p>
          <p className="stat-card-subtext">+2 from yesterday</p>
        </div>

        <div className="stat-card-container flex flex-col">
          <p className="stat-card-label">Trials This Month</p>
          <p className="stat-card-number">{monthCount}</p>
          <p className="stat-card-subtext">15% up this month</p>
        </div>

        <div className="stat-card-container flex flex-col">
          <p className="stat-card-label">Satisfaction Score</p>
          <p className="stat-card-number">4.9</p>
          <p className="stat-card-subtext">Based on 42 reviews</p>
        </div>
      </div>

      {/* ACTIVITY SECTION */}
      <div>
        <h2 className="section-title mb-4">Today's work</h2>
        <MeasureDivider />
        
        <div className="mt-6 flex flex-col gap-3">
          {todayTrials.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 border border-dashed border-[var(--ink-faint)] rounded-[12px] bg-[var(--bg-surface)]">
              <p className="empty-state-text">The day is fresh. Start your first trial.</p>
              <Link href="/dashboard/new-trial" className="cta-button">
                Begin a new trial &rarr;
              </Link>
            </div>
          ) : (
            todayTrials.map((trial, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--stitch)] rounded-[8px] hover:border-[var(--thread-gold)] transition-colors cursor-pointer">
                {/* Real items would go here */}
              </div>
            ))
          )}
        </div>
      </div>

      {/* QUICK ACTION BANNER */}
      <div className="w-full bg-[var(--bg-deep)] rounded-[12px] p-[24px_32px] flex items-center justify-between relative overflow-hidden">
        {/* Woven Fabric Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 8px)',
          }}
        />
        
        <h3 className="bottom-banner-text relative z-10">
          Ready for your next customer?
        </h3>
        
        <Link href="/dashboard/new-trial" className="bottom-banner-btn relative z-10">
          Start New Trial &rarr;
        </Link>
      </div>

    </div>
  );
}
