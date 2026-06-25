# Devsiy Deployment Notes

## Vercel (Recommended)

1. Push code to GitHub.
2. Import repo in Vercel dashboard.
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Vercel auto-detects Vite; output directory is `dist/`.
5. API routes in `api/` deploy as Vercel Serverless Functions.

## Docker

```bash
cp .env.example .env
# edit .env with your Supabase credentials
docker-compose up --build
```

## Environment Variables

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Admin Access

After seeding the auth user, log in at `/admin/login` with the credentials created via `supabase_auth_create_user`.

## Post-Deployment Checks

1. Homepage loads without console errors.
2. `/api/site-settings` returns JSON.
3. `/api/categories` returns categories.
4. Lead form submits successfully.
5. Admin login works and dashboard loads leads.
