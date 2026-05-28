import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await request.json();

    // Map planId to amount (in paise)
    let amount = 0;
    if (planId === "basic") {
      amount = 49900; // ₹499
    } else if (planId === "pro") {
      amount = 99900; // ₹999
    } else {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Initialize Razorpay
    // You should put these in .env.local: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_mock",
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${user.id}_${Date.now()}`,
      notes: {
        userId: user.id,
        planId,
      },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (error: any) {
    console.error("Razorpay order error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
