-- Add new columns for billing and settings to shops table
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS plan_id text DEFAULT 'free';
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS trials_used integer DEFAULT 0;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS renewal_date timestamp with time zone;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS logo_url text;

-- Create logos storage bucket if it doesn't exist (NOTE: this might need to be run as superuser or just created via Dashboard)
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT DO NOTHING;

-- Set up RLS for logos bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
CREATE POLICY "Auth Users can insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'logos' AND auth.role() = 'authenticated');

-- Create orders table for Razorpay payments
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    payment_id TEXT,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    plan_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'created',
    failure_reason TEXT,
    refund_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE
);

-- Set up RLS for orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);
