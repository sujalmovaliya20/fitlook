import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FabricCard } from "@/components/tailor/FabricCard";
import { ChalkLabel } from "@/components/tailor/ChalkLabel";
import { MeasurementBadge } from "@/components/tailor/MeasurementBadge";
import { MeasureDivider } from "@/components/tailor/MeasureDivider";
import { ThreadButton } from "@/components/tailor/ThreadButton";

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let todayCount = 0;
  let monthCount = 0;
  let ownerName = "Shop Owner";

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
      .select("owner_name")
      .eq("id", user.id)
      .single();

    if (!errToday && cToday !== null) todayCount = cToday;
    if (!errMonth && cMonth !== null) monthCount = cMonth;
    if (shopData?.owner_name) {
      ownerName = shopData.owner_name.split(" ")[0]; // Get first name
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
        <ChalkLabel>Today's Atelier</ChalkLabel>
        <h1 className="font-[family-name:var(--font-serif)] text-[clamp(20px,5vw,30px)] text-[var(--ink-dark)] mt-2 mb-1">
          {greeting}, {ownerName}.
        </h1>
        <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)]">
          {formattedDate} &nbsp;&mdash;&nbsp; Ahmedabad
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FabricCard className="border-l-[3px] border-l-[var(--thread-gold)] pl-5 flex flex-col gap-3">
          <ChalkLabel>Trials Today</ChalkLabel>
          <MeasurementBadge value={todayCount} size="lg" />
          <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-light)]">+2 from yesterday</p>
        </FabricCard>

        <FabricCard className="border-l-[3px] border-l-[var(--fabric-teal)] pl-5 flex flex-col gap-3">
          <ChalkLabel>Trials This Month</ChalkLabel>
          <MeasurementBadge value={monthCount} size="lg" />
          <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-light)]">15% up this month</p>
        </FabricCard>

        <FabricCard className="border-l-[3px] border-l-[var(--fabric-red)] pl-5 flex flex-col gap-3">
          <ChalkLabel>Satisfaction Score</ChalkLabel>
          <MeasurementBadge value="4.9" size="lg" />
          <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-light)]">Based on 42 reviews</p>
        </FabricCard>
      </div>

      {/* ACTIVITY SECTION */}
      <div>
        <h2 className="font-[family-name:var(--font-serif)] italic text-[clamp(15px,3.5vw,18px)] text-[var(--ink-dark)] mb-4">Today's work</h2>
        <MeasureDivider />
        
        <div className="mt-6 flex flex-col gap-3">
          {todayTrials.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 border border-dashed border-[var(--ink-faint)] rounded-[12px] bg-[var(--bg-surface)]">
              <p className="font-[family-name:var(--font-serif)] italic text-[clamp(14px,3vw,16px)] text-[var(--ink-light)]">The day is fresh. Start your first trial.</p>
              <Link href="/dashboard/new-trial">
                <ThreadButton variant="ghost">Begin a new trial &rarr;</ThreadButton>
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
        
        <h3 className="font-[family-name:var(--font-serif)] text-[clamp(16px,4vw,20px)] text-[var(--bg-parchment)] relative z-10">
          Ready for your next customer?
        </h3>
        
        <Link href="/dashboard/new-trial" className="relative z-10">
          <ThreadButton className="bg-[var(--bg-parchment)] text-[var(--ink-dark)] hover:bg-[var(--bg-surface)] hover:text-[var(--ink-dark)] border-[var(--bg-parchment)]">
            Start New Trial &rarr;
          </ThreadButton>
        </Link>
      </div>

    </div>
  );
}
