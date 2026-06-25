-- Devsiy seed data

-- Categories
INSERT INTO public.categories (name, slug, display_order) VALUES
('E-commerce', 'ecommerce', 1),
('Corporate', 'corporate', 2),
('SaaS', 'saas', 3),
('Portfolio', 'portfolio', 4),
('Landing Pages', 'landing-pages', 5)
ON CONFLICT (slug) DO NOTHING;

-- Website skins
INSERT INTO public.website_skins (name, key, is_active, special_offer_text, badge_color) VALUES
('Christmas Special', 'christmas', false, '❄️ Christmas Special Offer — 20% Off', '#dc2626'),
('New Year Special', 'newyear', false, '🎉 New Year Special — Fresh Start Offer', '#f59e0b'),
('Festival Season', 'festival', false, '🚡 Festival Season Offer — Celebrate with Us', '#f97316')
ON CONFLICT (key) DO NOTHING;

-- Hosting plans
INSERT INTO public.hosting_plans (name, price, duration, features, is_popular, display_order, is_active) VALUES
('Starter', '₹499', 'month', '["1 Website", "10 GB SSD Storage", "Free SSL Certificate", "Weekly Backups", "Email Support"]', false, 1, true),
('Business', '₹999', 'month', '["5 Websites", "50 GB SSD Storage", "Free SSL Certificate", "Daily Backups", "Priority Support", "CDN Included"]', true, 2, true),
('Enterprise', '₹2,499', 'month', '["Unlimited Websites", "200 GB SSD Storage", "Premium SSL", "Hourly Backups", "24/7 Dedicated Support", "Advanced Security", "Custom Server Config"]', false, 3, true);

-- Site settings
INSERT INTO public.site_settings (key, value) VALUES
('hero_tagline', 'PREMIUM WEB DESIGN AGENCY'),
('hero_subtitle', 'Quality over quantity. Bespoke websites, e-commerce platforms, and digital products for brands that demand excellence.'),
('about_paragraph_1', 'Devsiy is a premium digital agency focused on designing and developing websites that elevate brands. From high-converting e-commerce stores to bespoke corporate platforms, we build with intention.'),
('about_paragraph_2', 'Our philosophy is simple: quality over quantity. We partner with a select number of clients each quarter so every project receives the creative and technical excellence it deserves.'),
('hero_image_url', ''),
('banner_image_url', ''),
('mobile_number', '+91-98765-43210'),
('contact_email', 'hello@devsiy.com'),
('footer_tagline', 'Premium website design and development agency. Quality over quantity, always.'),
('appointment_url', 'https://calendar.google.com/calendar/u/0/appointments')
ON CONFLICT (key) DO NOTHING;

-- FAQs
INSERT INTO public.faqs (question, answer, display_order, is_active) VALUES
('What types of websites do you build?', 'We design and develop all types of websites including e-commerce stores, corporate websites, SaaS platforms, portfolios, landing pages, and custom web applications.', 1, true),
('How long does a typical project take?', 'Timelines vary based on complexity. A simple website takes 2-3 weeks, while larger e-commerce or custom platforms may take 6-12 weeks.', 2, true),
('Do you provide website maintenance?', 'Yes, we offer comprehensive maintenance and support packages to keep your website secure, updated, and running smoothly.', 3, true),
('What is your pricing model?', 'We quote based on project scope, features, and complexity. Every proposal is tailored to your specific requirements and budget.', 4, true),
('Will my website be mobile-friendly?', 'Absolutely. Every website we build is fully responsive and optimized for all devices.', 5, true);

-- Founders
INSERT INTO public.founders (role, name, title, bio, image_url, display_order) VALUES
('founder', 'Aryan Sharma', 'Creative Director & CEO', 'With over a decade of experience in digital design, Aryan leads Devsiy with a vision for quality-driven, luxury web experiences.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 1),
('co-founder', 'Priya Mehta', 'Head of Strategy & Operations', 'Priya ensures every project runs seamlessly, blending business strategy with world-class execution for our clients.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', 2);
