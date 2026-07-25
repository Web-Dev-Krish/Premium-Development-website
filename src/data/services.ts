// Central services data source.
// Used by both the homepage Services grid and the individual
// per-service detail pages (/services/:slug) so both stay in sync.

export interface ServiceData {
  slug: string;
  icon: 'palette' | 'shopping-bag' | 'code' | 'smartphone' | 'search' | 'settings';
  title: string;
  desc: string;
  longDescription: string[];
  features: string[];
}

export const services: ServiceData[] = [
  {
    slug: 'website-design',
    icon: 'palette',
    title: 'Website Design',
    desc: 'Websites designed around one goal: converting visitors into leads for your business.',
    longDescription: [
      'We design websites with a single purpose in mind — turning visitors into paying customers. Every layout, headline, and call-to-action is placed with intent, not decoration.',
      'Our process starts with understanding your business, your audience, and what makes you different. From there, we craft a visual identity and page structure that builds trust within seconds and guides visitors toward taking action.',
      'No generic templates. Every site we design is built from scratch around your brand, your offer, and your goals.',
    ],
    features: [
      'Custom layout and visual design, no templates',
      'Conversion-focused copy and page structure',
      'Mobile-first, fully responsive design',
      'Brand-aligned visuals, colors, and typography',
      'Fast-loading, modern front-end build',
    ],
  },
  {
    slug: 'e-commerce-development',
    icon: 'shopping-bag',
    title: 'E-commerce Development',
    desc: 'High-converting online stores on Shopify, WooCommerce, and custom platforms.',
    longDescription: [
      'We build online stores that make it effortless for customers to browse, decide, and buy. Whether you need a Shopify store, a WooCommerce setup, or a fully custom platform, we tailor the build to your products and audience.',
      'Every store we build includes smooth product discovery, a frictionless checkout, and the integrations you need — payments, shipping, inventory, and marketing tools — all working together.',
      'We also focus on performance and trust signals, because a slow or unclear store loses sales before a customer ever reaches checkout.',
    ],
    features: [
      'Shopify, WooCommerce, and custom store builds',
      'Secure payment gateway integration',
      'Product catalog, inventory, and order management setup',
      'Optimized checkout flow to reduce cart abandonment',
      'Mobile shopping experience built for speed',
    ],
  },
  {
    slug: 'lead-generation-automation',
    icon: 'code',
    title: 'Lead Generation & Automation',
    desc: 'Forms, follow-ups, and notifications that capture and route every lead automatically.',
    longDescription: [
      'A great website is only half the job — the other half is making sure every enquiry actually reaches you and gets followed up. We build lead capture systems that work quietly in the background so no opportunity slips through.',
      'This includes smart forms, instant notifications, automated follow-up sequences, and routing rules that send each lead to the right place immediately.',
      'The result is a system where leads are captured, organized, and acted on automatically, saving you hours of manual work every week.',
    ],
    features: [
      'Custom lead capture forms with validation',
      'Instant email/SMS notifications on new leads',
      'Automated follow-up sequences',
      'Lead routing and CRM-style organization',
      'Analytics on lead sources and conversion rates',
    ],
  },
  {
    slug: 'ui-ux-design',
    icon: 'smartphone',
    title: 'UI/UX Design',
    desc: 'Interfaces designed to guide visitors toward taking action, not just look good.',
    longDescription: [
      'Good design is more than aesthetics — it is about guiding people toward a decision. We design interfaces that are intuitive, visually clean, and structured to reduce friction at every step.',
      'We map out user journeys before we design a single screen, making sure navigation, hierarchy, and calls-to-action feel natural rather than forced.',
      'Whether it is a website, web app, or product interface, our goal is always the same: make it effortless for people to understand what to do next.',
    ],
    features: [
      'User journey mapping and wireframing',
      'Clean, modern visual interface design',
      'Interaction and micro-animation design',
      'Accessibility-conscious design choices',
      'Design systems for consistency across pages',
    ],
  },
  {
    slug: 'seo-performance',
    icon: 'search',
    title: 'SEO & Performance',
    desc: 'Technical optimization that puts your business in front of the right audience.',
    longDescription: [
      'A beautiful website does not help if no one finds it. We handle the technical and on-page SEO fundamentals that help your business rank and get discovered by the right audience.',
      'This includes optimizing page speed, site structure, metadata, and content so search engines can properly understand and index your site.',
      'We also focus on core web vitals and performance, because ranking well and providing a fast experience go hand in hand.',
    ],
    features: [
      'Technical SEO audit and fixes',
      'On-page optimization (metadata, headings, structure)',
      'Page speed and Core Web Vitals optimization',
      'Sitemap, robots.txt, and search console setup',
      'Ongoing performance monitoring',
    ],
  },
  {
    slug: 'maintenance-support',
    icon: 'settings',
    title: 'Maintenance & Support',
    desc: 'Ongoing care, updates, and hosting management so you stay focused on growth.',
    longDescription: [
      'Launching a website is just the beginning. We provide ongoing maintenance and support so your site stays secure, fast, and up to date without you having to think about it.',
      'This includes regular updates, monitoring, backups, and hosting management, along with quick turnaround support whenever you need a change or run into an issue.',
      'Our goal is to let you focus on running your business while we take care of keeping your website running smoothly.',
    ],
    features: [
      'Regular updates and security monitoring',
      'Scheduled backups and uptime monitoring',
      'Hosting setup and management',
      'Priority support for changes and fixes',
      'Performance health checks',
    ],
  },
];

export function getServiceBySlug(slug: string | undefined): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
