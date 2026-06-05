import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, currency = 'INR' } = body;

    // DEBUG: check if keys are present
    console.log('[DEBUG] RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID, 'Length:', process.env.RAZORPAY_KEY_ID?.length);
    console.log('[DEBUG] RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET, 'Length:', process.env.RAZORPAY_KEY_SECRET?.length);

    // Validate inputs server-side
    if (!planId) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    // NEVER trust frontend amount — fetch from DB or server config
    // We map planId to amount (in paise)
    let verifiedAmount = 0;
    if (planId === 'basic') {
      verifiedAmount = 49900; // ₹499
    } else if (planId === 'pro') {
      verifiedAmount = 99900; // ₹999
    } else {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const options = {
      amount: verifiedAmount,
      currency: currency,
      // Razorpay receipt limit is 40 characters
      receipt: `rcpt_${Math.floor(Date.now() / 1000).toString()}`,
      notes: {
        userId: user.id,
        planId: planId,
        userEmail: user.email || '',
      },
    };

    const order = await razorpay.orders.create(options);

    // Save order to DB with status: 'created'
    const adminSupabase = createAdminClient();
    const { error: dbError } = await adminSupabase
      .from('orders')
      .insert({
        order_id: order.id,
        user_id: user.id,
        plan_id: planId,
        amount: verifiedAmount,
        currency: currency,
        status: 'created',
      });

    if (dbError) {
      console.error('[CREATE ORDER DB ERROR]', dbError);
      return NextResponse.json({ error: 'Failed to save order to database' }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (error: any) {
    console.error('[CREATE ORDER ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
