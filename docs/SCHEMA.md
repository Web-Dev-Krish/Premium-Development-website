# Devsiy Supabase Schema

## Overview

- **Database**: PostgreSQL 15+
- **Auth**: Supabase Auth (`auth.users`)
- **Profiles**: `public.profiles` extends `auth.users`
- **RLS**: Enabled on all tables; public read access for active content; authenticated admin access for mutations

## Entity Relationship Diagram

```
auth.users (1) ----< (1) public.profiles

public.categories (1) ----< (0..*) public.projects

public.featured_websites
public.founders
public.faqs
public.website_skins
public.hosting_plans
public.leads
public.site_settings
```

## Tables

### `profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | References auth.users(id) |
| email | text | From auth user |
| full_name | text | Display name |
| avatar_url | text | Profile image |
| role | text | admin / editor / viewer |
| is_active | boolean | Soft enable flag |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

### `categories`
Content categories for portfolio/projects.

### `projects`
Portfolio items with optional category and featured flag.

### `featured_websites`
Curated homepage showcase cards.

### `founders`
Founder/co-founder profiles.

### `faqs`
Accordion FAQ entries with active flag.

### `website_skins`
Seasonal overlays (christmas, newyear, festival).

### `hosting_plans`
Three-tier hosting pricing with JSON features.

### `leads`
Customer inquiries with budget, currency, urgency, and status.

### `site_settings`
Key-value store for customizable site text.

## RLS Summary

| Table | Public | Authenticated |
|-------|--------|---------------|
| profiles | read own | read own, update own |
| categories | read | full |
| projects | read | full |
| featured_websites | read | full |
| founders | read | full |
| faqs | read active | full |
| website_skins | read | full |
| hosting_plans | read active | full |
| leads | insert | full |
| site_settings | read | full |

## Files

- `supabase/migrations/001_initial_schema.sql` — Schema + RLS
- `supabase/migrations/002_seed_data.sql` — Seed content
