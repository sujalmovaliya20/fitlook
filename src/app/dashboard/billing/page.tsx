"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { FabricCard } from "@/components/tailor/FabricCard";
import { ChalkLabel } from "@/components/tailor/ChalkLabel";
import { MeasureDivider } from "@/components/tailor/MeasureDivider";
import { ThreadButton } from "@/components/tailor/ThreadButton";
import { PaymentButton } from "@/components/PaymentButton";

type ShopData = {
  id: string;
  plan_id: string;
  trials_used: number;
  renewal_date: string | null;
};

const PLANS = {
  free: { id: "free", name: "Free Atelier", limit: 10, price: "₹0" },
  basic: { id: "basic", name: "Growing Atelier", limit: 100, price: "₹499" },
  pro: { id: "pro", name: "Master Atelier", limit: Infinity, price: "₹999" },
};

export default function BillingPage() {
  const supabase = createClient();
  const [shop, setShop] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadBillingData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("shops")
          .select("id, plan_id, trials_used, renewal_date")
          .eq("id", user.id)
          .single();
        
        if (data) setShop(data);
      }
      setLoading(false);
    }
    loadBillingData();
  }, [supabase]);



  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        {/* Simple elegant loader */}
        <div className="w-8 h-8 border-[2px] border-[var(--stitch)] border-t-[var(--thread-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentPlanId = shop?.plan_id || "free";
  const planInfo = PLANS[currentPlanId as keyof typeof PLANS] || PLANS.free;
  
  // Calculate usage
  const limit = planInfo.limit;
  const used = shop?.trials_used || 0;
  const usagePercentage = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);
  const remaining = limit === Infinity ? "Unlimited" : Math.max(0, limit - used);

  return (
    <>

      <div className="max-w-5xl mx-auto space-y-12 pb-12 mt-4">
        
        {/* PAGE HEADER */}
        <div>
          <h1 className="font-[family-name:var(--font-serif)] text-[clamp(20px,5vw,30px)] text-[var(--ink-dark)] mb-1">Subscription & Plans</h1>
          <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)]">Choose the plan that fits your atelier</p>
        </div>

        {/* CURRENT PLAN CARD */}
        <FabricCard className="w-full border-l-[4px] border-l-[var(--thread-gold)] p-0 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side */}
            <div className="flex-1 p-4 md:p-6 lg:p-8 md:p-10 flex flex-col justify-center">
              <ChalkLabel className="mb-2">Your Current Plan</ChalkLabel>
              <h2 className="font-[family-name:var(--font-serif)] text-[clamp(16px,4vw,20px)] text-[var(--ink-dark)] mb-1">{planInfo.name}</h2>
              <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-light)]">
                {shop?.renewal_date ? `Renews on ${new Date(shop.renewal_date).toLocaleDateString()}` : "Free tier · No expiry"}
              </p>
            </div>
            
            {/* Divider (CSS) */}
            <div className="w-full h-[1px] md:w-[1px] md:h-auto bg-[var(--stitch-strong)] border-none shrink-0" />
            
            {/* Right Side */}
            <div className="flex-1 p-4 md:p-6 lg:p-8 md:p-10 flex flex-col justify-center">
              <ChalkLabel className="mb-2">Trials Used This Month</ChalkLabel>
              <div className="font-[family-name:var(--font-mono)] font-light text-[clamp(20px,5vw,30px)] text-[var(--thread-gold)] mb-3">
                {used} / {limit === Infinity ? "∞" : limit}
              </div>
              
              {limit !== Infinity && (
                <>
                  <div className="w-full h-[6px] bg-[var(--bg-surface)] rounded-[3px] overflow-hidden mb-2">
                    <div 
                      className="h-full bg-[var(--thread-gold)] rounded-[3px] transition-all duration-1000 ease-out delay-300"
                      style={{ width: mounted ? `${usagePercentage}%` : "0%" }}
                    />
                  </div>
                  <p className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-faint)]">
                    {remaining} trials remaining
                  </p>
                </>
              )}
            </div>
          </div>
        </FabricCard>

        {/* PLANS SECTION */}
        <div>
          <h2 className="font-[family-name:var(--font-serif)] italic text-[clamp(16px,4vw,20px)] text-[var(--ink-dark)] mb-4">Available Plans</h2>
          <MeasureDivider />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            {/* FREE PLAN */}
            <FabricCard className="flex flex-col h-full">
              <div className="mb-6">
                <ChalkLabel className="mb-3 block">Starter</ChalkLabel>
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-mono)] font-light text-[clamp(22px,6vw,36px)] text-[var(--ink-mid)]">{PLANS.free.price}</span>
                  <span className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-faint)]">/month</span>
                </div>
              </div>
              
              <div className="flex-1 mb-8">
                <ul className="flex flex-col gap-[8px]">
                  <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                    <span className="text-[var(--ink-faint)]">—</span> 10 virtual trials per month
                  </li>
                  <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                    <span className="text-[var(--ink-faint)]">—</span> Standard generation speed
                  </li>
                  <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                    <span className="text-[var(--ink-faint)]">—</span> Basic email support
                  </li>
                </ul>
              </div>
              
              <div className="mt-auto">
                <MeasureDivider className="mb-6" />
                <ThreadButton variant="ghost" className="w-full opacity-50 cursor-default" disabled>
                  Current Plan
                </ThreadButton>
              </div>
            </FabricCard>

            {/* BASIC PLAN */}
            <div className="relative flex flex-col h-full">
              {/* Floating Banner */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-[var(--bg-card)] rounded-[4px] px-[10px] py-[3px] border border-[var(--thread-gold)] shadow-sm">
                <span className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--thread-gold)] tracking-widest uppercase">
                  Most Popular ✦
                </span>
              </div>
              
              <FabricCard className="flex flex-col h-full border-t-[3px] border-t-[var(--thread-gold)] pt-8">
                <div className="mb-6">
                  <ChalkLabel className="mb-3 block text-[var(--thread-gold)]">Growing Atelier</ChalkLabel>
                  <div className="flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-mono)] font-light text-[clamp(22px,6vw,36px)] text-[var(--ink-dark)]">{PLANS.basic.price}</span>
                    <span className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-faint)]">/month</span>
                  </div>
                </div>
                
                <div className="flex-1 mb-8">
                  <ul className="flex flex-col gap-[8px]">
                    <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                      <span className="text-[var(--thread-gold)]">—</span> 100 virtual trials per month
                    </li>
                    <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                      <span className="text-[var(--thread-gold)]">—</span> Priority generation queue
                    </li>
                    <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                      <span className="text-[var(--thread-gold)]">—</span> 24/7 dedicated support
                    </li>
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <MeasureDivider className="mb-6" />
                  {currentPlanId === "basic" ? (
                    <ThreadButton variant="ghost" className="w-full opacity-50 cursor-default" disabled>
                      Current Plan
                    </ThreadButton>
                  ) : (
                    <PaymentButton planId="basic" planName="Growing Atelier" displayAmount={499} />
                  )}
                </div>
              </FabricCard>
            </div>

            {/* PRO PLAN */}
            <FabricCard className="flex flex-col h-full border-t-[3px] border-t-[var(--fabric-teal)]">
              <div className="mb-6">
                <ChalkLabel className="mb-3 block text-[var(--fabric-teal)]">Master Atelier</ChalkLabel>
                <div className="flex items-baseline gap-1">
                  <span className="font-[family-name:var(--font-mono)] font-light text-[clamp(22px,6vw,36px)] text-[var(--fabric-teal)]">{PLANS.pro.price}</span>
                  <span className="font-[family-name:var(--font-sans)] font-light text-[clamp(10px,2vw,12px)] text-[var(--ink-faint)]">/month</span>
                </div>
              </div>
              
              <div className="flex-1 mb-8">
                <ul className="flex flex-col gap-[8px]">
                  <li className="font-[family-name:var(--font-sans)] text-[clamp(12px,2.5vw,14px)] text-[var(--ink-dark)] font-bold flex items-start gap-2">
                    <span className="text-[var(--fabric-teal)] font-normal">—</span> Unlimited trials
                  </li>
                  <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                    <span className="text-[var(--fabric-teal)]">—</span> Highest priority generation
                  </li>
                  <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                    <span className="text-[var(--fabric-teal)]">—</span> API access for bulk orders
                  </li>
                  <li className="font-[family-name:var(--font-sans)] font-light text-[clamp(12px,2.5vw,14px)] text-[var(--ink-mid)] flex items-start gap-2">
                    <span className="text-[var(--fabric-teal)]">—</span> Dedicated account manager
                  </li>
                </ul>
              </div>
              
              <div className="mt-auto">
                <MeasureDivider className="mb-6" />
                  {currentPlanId === "pro" ? (
                  <ThreadButton variant="ghost" className="w-full opacity-50 cursor-default" disabled>
                    Current Plan
                  </ThreadButton>
                ) : (
                  <PaymentButton planId="pro" planName="Master Atelier" displayAmount={999} />
                )}
              </div>
            </FabricCard>

          </div>
        </div>

      </div>
    </>
  );
}
