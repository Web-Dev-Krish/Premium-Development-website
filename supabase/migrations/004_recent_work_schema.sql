-- Migration: Recent Work Schema
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

ALTER TABLE public.recent_works ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active recent works" ON public.recent_works;
CREATE POLICY "Public can view active recent works" ON public.recent_works
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access to recent works" ON public.recent_works;
CREATE POLICY "Admin full access to recent works" ON public.recent_works
    FOR ALL USING (auth.role() = 'authenticated' OR auth.jwt() ->> 'role' = 'admin');

CREATE INDEX IF NOT EXISTS idx_recent_works_order ON public.recent_works(display_order ASC, created_at DESC);
