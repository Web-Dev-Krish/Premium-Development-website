-- ============================================================
-- Devsiy Agency Platform — Recent Work Schema & Seed Script
-- Execute this SQL script in Supabase SQL Editor to set up the recent_works table.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.recent_works (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    media_url TEXT NOT NULL,
    instagram_url TEXT DEFAULT '',
    facebook_url TEXT DEFAULT '',
    youtube_url TEXT DEFAULT '',
    show_instagram BOOLEAN NOT NULL DEFAULT true,
    show_facebook BOOLEAN NOT NULL DEFAULT true,
    show_youtube BOOLEAN NOT NULL DEFAULT true,
    show_social_buttons BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments
COMMENT ON TABLE public.recent_works IS 'Showcase of recent work with image/video media and customizable social media links';

-- Enable Row Level Security (RLS)
ALTER TABLE public.recent_works ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public can view active recent works" ON public.recent_works;
CREATE POLICY "Public can view active recent works" ON public.recent_works
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to recent works" ON public.recent_works;
CREATE POLICY "Admin full access to recent works" ON public.recent_works
    FOR ALL USING (auth.role() = 'authenticated' OR auth.jwt() ->> 'role' = 'admin');

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_recent_works_order ON public.recent_works(display_order ASC, created_at DESC);

-- Sample Seed Data
INSERT INTO public.recent_works 
(title, description, media_type, media_url, instagram_url, facebook_url, youtube_url, show_instagram, show_facebook, show_youtube, show_social_buttons, display_order, is_active)
VALUES
(
    'Aura Luxury E-Commerce Platform',
    'Full-stack custom luxury e-commerce experience built with high performance animations and instant checkout flow.',
    'image',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'https://instagram.com',
    'https://facebook.com',
    'https://youtube.com',
    true, true, true, true, 1, true
),
(
    'SaaS Analytics Dashboard Showcase',
    'Interactive dashboard design & build with real-time WebSocket metrics and custom skin engine.',
    'video',
    'https://assets.mixkit.co/videos/preview/mixkit-working-on-a-laptop-in-a-modern-office-41586-large.mp4',
    'https://instagram.com',
    'https://facebook.com',
    'https://youtube.com',
    true, true, true, true, 2, true
)
ON CONFLICT DO NOTHING;
