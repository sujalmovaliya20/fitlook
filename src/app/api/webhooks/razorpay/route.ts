import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js"; // Using admin client for webhook

export async function POST(request: Request) {
  try {
    const textBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // Verify webhook signature (Requires RAZORPAY_WEBHOOK_SECRET in .env.local)
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "webhook_secret_mock";
    
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(textBody)
      .digest("hex");

    if (expectedSignature !== signature && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(textBody);

    if (payload.event === "payment.captured" || payload.event === "order.paid") {
      // Payment successful, update user
      const paymentEntity = payload.payload.payment.entity;
      const notes = payload.payload.payment.entity.notes || payload.payload.order?.entity?.notes;
      
      const userId = notes?.userId;
      const planId = notes?.planId;

      if (userId && planId) {
        // Init Supabase admin client to bypass RLS in webhook
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        // If no service role key, we'll try with anon key but it might fail RLS
        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

        // Calculate renewal date (1 month from now)
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);

        const { error } = await supabase
          .from("shops")
          .update({
            plan_id: planId,
            trials_used: 0, // Reset trials on new payment
            renewal_date: renewalDate.toISOString(),
          })
          .eq("id", userId);

        if (error) {
          console.error("Error updating shop billing:", error);
          return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
