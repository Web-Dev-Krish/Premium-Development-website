# Devsiy Black-Screen Debugging Guide

## Quick Diagnostic Checklist

| # | Check | Command / Action | Expected Result |
|---|-------|------------------|-----------------|
| 1 | HTML returns 200 | `curl -I https://<site>/` | `HTTP/2 200` |
| 2 | `#root` div exists | View page source | `<div id="root"></div>` present |
| 3 | JS/CSS assets load | Network tab / `curl <asset-url>` | `200`, correct MIME type |
| 4 | No JS runtime errors | Browser DevTools Console | Zero red errors |
| 5 | Environment variables present | `printenv | grep VITE_` or Vercel dashboard | All required vars set |
| 6 | Supabase reachable | `curl <SUPABASE_URL>/rest/v1/` | Returns 401 (auth required) |
| 7 | API routes respond | `curl /api/site-settings` | JSON payload |

## Common Root Causes & Fixes

### 1. Missing or Empty `#root` Element
- **Symptom**: White/black screen, no React mount.
- **Fix**: Ensure `index.html` contains `<div id="root"></div>` before the app script.
- **Code**: See `src/main.tsx` boot guard that renders an error if `#root` is missing.

### 2. JavaScript Runtime Crash
- **Symptom**: Black screen, console shows red error.
- **Fix**: Wrap app in `ErrorBoundary`. Added in `src/components/ErrorBoundary.tsx`.

### 3. Missing Environment Variables
- **Symptom**: `Supabase URL is required` or silent failure.
- **Fix**: `src/lib/env.ts` validates `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on startup and displays a friendly config error.

### 4. API Failure on First Render
- **Symptom**: Components mount but data never loads; blank sections.
- **Fix**: Every data component shows a loading spinner and catches fetch errors (see `Home.tsx`, `Portfolio.tsx`).

### 5. Hydration Mismatch (SSR/CSR)
- **Symptom**: React hydration warning then blank screen.
- **Fix**: Use `useEffect` for client-only data, avoid rendering different content on server vs client. Devsiy is SPA-only; no SSR mismatch.

### 6. CSS Makes Everything Black
- **Symptom**: Content exists but invisible.
- **Fix**: Body background is intentionally dark; text is light. If CSS fails to load, add inline fallback color in `index.html`.

### 7. Lazy-Load Suspense Missing
- **Symptom**: `React.Suspense` error or blank while chunk loads.
- **Fix**: `App.tsx` is lazy-loaded in `main.tsx` with a `Suspense` fallback.

## Network Diagnostics

```bash
# Verify HTML
curl -s https://<site>/ | grep -E 'id="root"|src="/assets/'

# Verify API
curl -s https://<site>/api/site-settings | jq .

# Verify assets
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://<site>/assets/index-*.js
```

## Local Development Diagnostics

```bash
npm run build
npm run preview
```

Open DevTools and confirm:
- Console has no errors.
- `window.__DEVSIY_ENV` is not defined (production).
- Supabase requests return `200` or `401` (never `0` / CORS blocked).

## Deployment Notes

- Vercel auto-detects Vite; `dist/` is the output directory.
- `vercel.json` contains env vars and SPA rewrite to `index.html`.
- API routes in `api/` are serverless functions.
