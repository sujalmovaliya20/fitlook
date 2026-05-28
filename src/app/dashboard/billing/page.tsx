"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import Script from "next/script";

type ShopData = {
  id: string;
  plan_id: string;
  trials_used: number;
  renewal_date: string | null;
};

const PLANS = {
  free: { name: "Free", limit: 10, price: "₹0/mo" },
  basic: { name: "Basic", limit: 100, price: "₹499/mo" },
  pro: { name: "Pro", limit: Infinity, price: "₹999/mo" },
};

export default function BillingPage() {
  const supabase = createClient();
  const [shop, setShop] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
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

  const handleUpgrade = async (planId: "basic" | "pro") => {
    if (!shop) return;
    setProcessingPlan(planId);

    try {
      // 1. Create order on backend
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Init Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock", // Provide your key here in .env.local
        amount: data.amount,
        currency: data.currency,
        name: "FitLook",
        description: `Upgrade to ${planId.toUpperCase()} Plan`,
        order_id: data.orderId,
        handler: function (response: any) {
          // This function runs on success.
          // Usually, the webhook handles DB updates, but we can optimistically reload here
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          window.location.reload();
        },
        prefill: {
          name: "Shop Owner",
          email: "owner@example.com",
        },
        theme: {
          color: "#1A1A2E",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error: any) {
      alert("Failed to initiate payment: " + error.message);
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return <div className="p-8">Loading billing info...</div>;
  }

  const currentPlanId = shop?.plan_id || "free";
  const planInfo = PLANS[currentPlanId as keyof typeof PLANS] || PLANS.free;
  const usagePercentage = planInfo.limit === Infinity ? 0 : Math.min(100, ((shop?.trials_used || 0) / planInfo.limit) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and track your usage.</p>
      </div>

      {/* Current Plan Overview */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader>
          <CardTitle>Current Plan: <span className="text-primary">{planInfo.name}</span></CardTitle>
          <CardDescription>
            {shop?.renewal_date ? `Renews on ${new Date(shop.renewal_date).toLocaleDateString()}` : "Free tier does not expire."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Trial Usage</span>
              <span className="text-muted-foreground">
                {shop?.trials_used || 0} / {planInfo.limit === Infinity ? "Unlimited" : planInfo.limit} Used
              </span>
            </div>
            
            {/* Progress Bar */}
            {planInfo.limit !== Infinity && (
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${usagePercentage > 90 ? 'bg-destructive' : 'bg-primary'}`} 
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}
            
            {usagePercentage >= 100 && planInfo.limit !== Infinity && (
              <div className="flex items-center text-destructive text-sm mt-2 font-medium">
                <AlertCircle className="w-4 h-4 mr-2" />
                You have reached your plan limit. Please upgrade to continue generating trials.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <Card className={currentPlanId === "free" ? "border-primary shadow-md" : ""}>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-2xl font-bold">{PLANS.free.price}</div>
              <CardDescription>Perfect for testing out FitLook.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> 10 Trials / month</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> Standard support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button disabled variant={currentPlanId === "free" ? "secondary" : "outline"} className="w-full">
                {currentPlanId === "free" ? "Current Plan" : "Downgrade"}
              </Button>
            </CardFooter>
          </Card>

          {/* Basic */}
          <Card className={currentPlanId === "basic" ? "border-primary shadow-md" : ""}>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <div className="text-2xl font-bold">{PLANS.basic.price}</div>
              <CardDescription>For growing boutiques.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> 100 Trials / month</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> Priority support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleUpgrade("basic")} 
                disabled={currentPlanId === "basic" || processingPlan === "basic"} 
                variant={currentPlanId === "basic" ? "secondary" : "default"} 
                className="w-full"
              >
                {currentPlanId === "basic" ? "Current Plan" : processingPlan === "basic" ? "Processing..." : "Upgrade to Basic"}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro */}
          <Card className={currentPlanId === "pro" ? "border-primary shadow-md" : ""}>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <div className="text-2xl font-bold">{PLANS.pro.price}</div>
              <CardDescription>For established fashion stores.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> Unlimited Trials</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-primary" /> 24/7 Priority support</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleUpgrade("pro")} 
                disabled={currentPlanId === "pro" || processingPlan === "pro"} 
                variant={currentPlanId === "pro" ? "secondary" : "default"} 
                className="w-full"
              >
                {currentPlanId === "pro" ? "Current Plan" : processingPlan === "pro" ? "Processing..." : "Upgrade to Pro"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
