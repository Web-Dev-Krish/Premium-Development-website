// Central services data source.
// Used by both the homepage Services grid and individual
// per-service detail pages (/services/:slug) so both stay in sync.

export interface ServiceData {
  slug: string;
  icon: 'globe' | 'smartphone' | 'target' | 'bot';
  title: string;
  desc: string;
  longDescription: string[];
  features: string[];
}

export const services: ServiceData[] = [
  {
    slug: 'website-development',
    icon: 'globe',
    title: 'Website Development',
    desc: 'High-performance, custom-built websites designed to captivate visitors and drive real business growth.',
    longDescription: [
      'We craft bespoke, modern websites optimized for speed, aesthetics, and maximum conversion rates. Every layout, animation, and line of code is structured to position your business as an industry leader.',
      'From sleek corporate sites to scalable web applications, our engineering ensures a seamless user experience across all devices and screen sizes.',
      'No generic templates. Every site we design is custom-built around your brand identity, business goals, and customer acquisition strategy.',
    ],
    features: [
      'Custom layout & responsive front-end engineering',
      'Lightning-fast load times & Core Web Vitals optimization',
      'Built-in technical SEO & search engine indexability',
      'Seamless CMS & content management integration',
      'Analytics, lead tracking & conversion optimization',
    ],
  },
  {
    slug: 'mobile-app-development',
    icon: 'smartphone',
    title: 'Mobile App Development',
    desc: 'Native and cross-platform mobile apps for iOS and Android built for speed, scalability, and engagement.',
    longDescription: [
      'Transform your vision into intuitive, feature-rich mobile applications built for both iOS and Android platforms.',
      'We specialize in modern cross-platform development (React Native & Flutter) and native architectures to deliver fluid performance, elegant UI, and robust offline capabilities.',
      'From user onboarding and push notifications to secure payment gateways and cloud synchronization, we handle the complete mobile app lifecycle.',
    ],
    features: [
      'iOS & Android cross-platform app development',
      'Intuitive, gesture-driven mobile UI/UX design',
      'Secure backend API integration & real-time sync',
      'Push notifications, user authentication & payments',
      'App Store & Google Play Store publishing guidance',
    ],
  },
  {
    slug: 'google-meta-ads',
    icon: 'target',
    title: 'Google & Meta Ads',
    desc: 'Data-driven paid ad campaigns across Google Search, Instagram, and Facebook to maximize ROI and leads.',
    longDescription: [
      'Scale your customer acquisition with high-converting paid ad campaigns across Google Ads, Instagram, and Facebook.',
      'We combine granular audience targeting, persuasive ad copy, striking visual assets, and bulletproof conversion tracking to maximize your Return on Ad Spend (ROAS).',
      'Continuous A/B testing and algorithmic bidding optimization ensure your ad budget is consistently directed to high-intent leads.',
    ],
    features: [
      'Google Search, Display & YouTube campaign management',
      'Meta (Facebook & Instagram) hyper-targeted ad sets',
      'High-converting ad copy & custom visual creative assets',
      'Pixel tracking, conversion setup & audience retargeting',
      'Transparent ROI reporting & weekly campaign optimization',
    ],
  },
  {
    slug: 'ai-chatbot-development',
    icon: 'bot',
    title: 'AI Chatbot Development',
    desc: 'Custom 24/7 AI conversational agents trained on your business to qualify leads and answer queries automatically.',
    longDescription: [
      'Supercharge customer engagement with custom AI chatbots trained specifically on your company business data, documentation, and offerings.',
      'Our AI conversational agents instantly answer customer queries, qualify inbound leads, schedule appointments, and guide prospects through your sales funnel.',
      'Seamlessly integrating with your website, WhatsApp, CRM, and internal databases, these intelligent bots work round-the-clock without human intervention.',
    ],
    features: [
      'Custom LLM & knowledge-base trained AI bots',
      '24/7 automated customer support & query resolution',
      'Lead qualification & automated appointment booking',
      'Seamless Website, WhatsApp & CRM integrations',
      'Multi-language support & intelligent live-agent handover',
    ],
  },
];

export function getServiceBySlug(slug: string | undefined): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}

