import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/utils/supabase/admin';

// Webhooks require raw body for signature verification
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );

    if (!isValid) {
      console.error('[WEBHOOK FRAUD ATTEMPT]', {
        timestamp: new Date().toISOString(),
        ip: request.headers.get('x-forwarded-for'),
      });
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const adminSupabase = createAdminClient();

    // Handle events idempotently
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(adminSupabase, event.payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(adminSupabase, event.payload.payment.entity);
        break;

      case 'refund.created':
        await handleRefundCreated(adminSupabase, event.payload.refund.entity);
        break;

      default:
        console.log('[WEBHOOK UNHANDLED EVENT]', event.event);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('[WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentCaptured(supabase: any, payment: any) {
  // Check if already processed (idempotency)
  const { data: existing } = await supabase
    .from('orders')
    .select('status, plan_id, user_id')
    .eq('order_id', payment.order_id)
    .single();

  if (existing?.status === 'paid') {
    console.log('[WEBHOOK DUPLICATE] Already processed:', payment.id);
    return;
  }

  await supabase
    .from('orders')
    .update({
      payment_id: payment.id,
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('order_id', payment.order_id);

  if (existing?.user_id && existing?.plan_id) {
    await supabase
      .from('shops')
      .update({ plan_id: existing.plan_id })
      .eq('id', existing.user_id);
  }
}

async function handlePaymentFailed(supabase: any, payment: any) {
  await supabase
    .from('orders')
    .update({
      payment_id: payment.id,
      status: 'failed',
      failed_at: new Date().toISOString(),
      failure_reason: payment.error_description,
    })
    .eq('order_id', payment.order_id);
}

async function handleRefundCreated(supabase: any, refund: any) {
  await supabase
    .from('orders')
    .update({
      status: 'refunded',
      refund_id: refund.id,
      refunded_at: new Date().toISOString(),
    })
    .eq('payment_id', refund.payment_id);
}
