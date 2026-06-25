-- Devsiy Agency Platform — Initial Schema
-- PostgreSQL 15+ / Supabase compatible

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. AUTH-LINKED USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'Extended user profiles linked to Supabase Auth';

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. SITE CONTENT TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    image_url TEXT,
    project_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Explicit foreign key for Supabase schema cache / referential integrity
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'projects_category_id_fkey'
    ) THEN
        ALTER TABLE public.projects
            ADD CONSTRAINT projects_category_id_fkey
            FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.featured_websites (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.founders (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('founder', 'co-founder')),
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.website_skins (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    special_offer_text TEXT,
    badge_color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hosting_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    duration TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leads (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    project_name TEXT NOT NULL,
    description TEXT,
    budget_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'INR')),
    urgency TEXT NOT NULL DEFAULT 'Medium' CHECK (urgency IN ('High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Closed')),
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id SERIAL PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_featured_websites_active ON public.featured_websites(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_hosting_plans_active ON public.hosting_plans(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- ============================================================
-- 4. UPDATED_AT TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY['profiles', 'leads', 'site_settings'])
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON public.%s', t, t);
        EXECUTE format('CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON public.%s FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t, t);
    END LOOP;
END $$;

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_skins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosting_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own; admins can read all
CREATE POLICY "Profiles read own"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Profiles update own"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Public tables: read-only for public, full access for authenticated admins
CREATE POLICY "Public read categories"
    ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read projects"
    ON public.projects FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read featured"
    ON public.featured_websites FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read founders"
    ON public.founders FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read active faqs"
    ON public.faqs FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public read skins"
    ON public.website_skins FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public read active hosting"
    ON public.hosting_plans FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public insert leads"
    ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public read site settings"
    ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

-- Admin-only mutations (authenticated users only; enforce admin role in API/service-role)
CREATE POLICY "Authenticated manage categories"
    ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated manage projects"
    ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated manage featured"
    ON public.featured_websites FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated manage founders"
    ON public.founders FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated manage faqs"
    ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated manage skins"
    ON public.website_skins FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated manage hosting"
    ON public.hosting_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated manage leads"
    ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated manage site settings"
    ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
