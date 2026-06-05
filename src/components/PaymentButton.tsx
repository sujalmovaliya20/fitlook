'use client';

import { useState } from 'react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface PaymentButtonProps {
  planId: string;
  planName: string;
  displayAmount: number;
}

export function PaymentButton({ planId, planName, displayAmount }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Payment gateway failed to load. Check internet connection.');
      }

      // Create order on server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json();
        throw new Error(err.error || 'Failed to initiate payment');
      }

      const { orderId, amount, currency, keyId } = await orderRes.json();

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'FitLook',
        description: planName,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on server
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error('Payment verification failed. Contact support.');
            }

            // Success — redirect or update UI
            window.location.href = '/dashboard?payment=success';

          } catch (verifyError: any) {
            setError(verifyError.message);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#b8962e', // Match premium brand gold
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment cancelled.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', function (response: any) {
        setError(
          response.error.description || 
          'Payment failed. Please try again.'
        );
        setLoading(false);
      });

      rzp.open();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-[var(--ink-dark)] hover:bg-[var(--ink-mid)] text-[var(--accent-gold)] py-3 px-4 rounded-md font-medium tracking-wide shadow-sm transition-all border border-[var(--stitch-strong)] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay ₹${displayAmount}`}
      </button>

      {error && (
        <p className="text-sm text-[var(--fabric-red)] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
