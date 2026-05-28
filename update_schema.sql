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
