-- Devsiy: refresh site copy tone (remove "premium/luxury" language, focus on
-- lead-generation & automation results) and add the lead notification emails setting.
--
-- Run this in the Supabase SQL editor (or via `supabase db push`) AFTER
-- 001_initial_schema.sql and 002_seed_data.sql have already been applied.
-- It only UPDATEs rows that still hold the original seeded copy, so it is
-- safe to run even if you've already customized some fields from the Admin Panel
-- (those won't be touched).

UPDATE public.site_settings SET value = 'WEBSITES BUILT TO GET YOU LEADS'
WHERE key = 'hero_tagline' AND value = 'PREMIUM WEB DESIGN AGENCY';

UPDATE public.site_settings SET value = 'We design, build, and automate websites that generate real leads for your business — not just good looks.'
WHERE key = 'hero_subtitle' AND value = 'Quality over quantity. Bespoke websites, e-commerce platforms, and digital products for brands that demand excellence.';

UPDATE public.site_settings SET value = 'Devsiy designs and builds websites focused on one thing: helping businesses generate more leads. From high-converting landing pages to full lead-generation and automation systems, we build with your growth in mind.'
WHERE key = 'about_paragraph_1' AND value = 'Devsiy is a premium digital agency focused on designing and developing websites that elevate brands. From high-converting e-commerce stores to bespoke corporate platforms, we build with intention.';

UPDATE public.site_settings SET value = 'We pair thoughtful design with automation — lead capture, instant notifications, and follow-up systems — so no opportunity slips through the cracks. We partner with a select number of clients at a time so every project gets the attention it needs.'
WHERE key = 'about_paragraph_2' AND value = 'Our philosophy is simple: quality over quantity. We partner with a select number of clients each quarter so every project receives the creative and technical excellence it deserves.';

UPDATE public.site_settings SET value = 'We design and build websites, lead-generation systems, and automation that help businesses win more customers.'
WHERE key = 'footer_tagline' AND value = 'Premium website design and development agency. Quality over quantity, always.';

-- New setting: comma-separated list of emails that get notified on every new lead.
-- Seed it with the existing contact_email so notifications work immediately; add
-- your co-founder's email (and anyone else's) from Admin Panel → Site Settings.
INSERT INTO public.site_settings (key, value)
SELECT 'notification_emails', (SELECT value FROM public.site_settings WHERE key = 'contact_email')
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'notification_emails');

-- Tone down the founder bio's "luxury" language.
UPDATE public.founders SET bio = 'With over a decade of experience in digital design, Aryan leads Devsiy with a focus on building websites that drive real, measurable results for clients.'
WHERE name = 'Aryan Sharma' AND bio LIKE '%luxury%';
