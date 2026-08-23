export const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#customers" },
  { label: "FAQ", href: "#faq" },
]

export const LOGOS = [
  "NORTHWIND",
  "LUMEN&CO",
  "KAVANA",
  "ORBITAL",
  "FIELDNOTES",
  "HELIOS",
  "VERDA",
  "PLINTH",
  "ATLAS FREIGHT",
  "MERIDIAN",
]

export const METRICS = [
  { value: 68, suffix: "%", label: "Conversations resolved with zero human touch" },
  { value: 11, suffix: "s", label: "Median first response, any hour of the day" },
  { value: 42, suffix: "", label: "Languages detected and answered natively" },
  { value: 4.8, suffix: "/5", label: "Average CSAT across 1.2M rated replies", decimals: 1 },
]

export const CAPABILITIES = [
  {
    title: "Grounded in your sources",
    body: "Point dedbot at your help centre, docs, Notion, PDFs, past tickets or a sitemap. Every answer is generated from retrieved passages and ships with a citation the reader can open.",
    tag: "Knowledge",
  },
  {
    title: "Knows when to shut up",
    body: "Set a confidence threshold. Below it, dedbot says so and routes the conversation to a human — transcript, summary, order history and a suggested next step attached.",
    tag: "Handoff",
  },
  {
    title: "42 languages, one bot",
    body: "Language is detected per message. Tone, formality and vocabulary are set once and hold across every locale — no bot-per-market sprawl.",
    tag: "Global",
  },
  {
    title: "Shows its receipts",
    body: "Resolution rate, deflection, handoff reasons, CSAT — plus the exact questions your docs failed to answer, which is effectively your next content roadmap.",
    tag: "Analytics",
  },
]

export const STEPS = [
  {
    index: "01",
    title: "Connect",
    body: "Plug in your sources and channels. Sitemaps, PDFs, Notion, Zendesk, Intercom, Slack, WhatsApp, or the REST API. Indexing starts immediately.",
    meta: "~12 minutes",
  },
  {
    index: "02",
    title: "Train",
    body: "Review the suggested answers dedbot drafts, correct the ones that miss, and set tone, length, guardrails and the confidence floor for escalation.",
    meta: "~90 minutes",
  },
  {
    index: "03",
    title: "Deploy",
    body: "One script tag on your site, or headless inside your own product. Watch resolutions climb in the dashboard from day one.",
    meta: "live same afternoon",
  },
]

export interface Plan {
  name: string
  monthly: number
  yearly: number
  blurb: string
  conversations: string
  features: string[]
  featured: boolean
  cta: string
}

export const PLANS: Plan[] = [
  {
    name: "Playground",
    monthly: 0,
    yearly: 0,
    blurb: "For a first taste, a side project, or a very small queue.",
    conversations: "200 conversations / month",
    features: ["1 bot, 3 knowledge sources", "Web widget + script tag", "42 languages", "Community support"],
    featured: false,
    cta: "Start free",
  },
  {
    name: "Studio",
    monthly: 99,
    yearly: 79,
    blurb: "For teams replacing the first two hours of every support shift.",
    conversations: "3,000 conversations / month",
    features: [
      "Unlimited knowledge sources",
      "Human handoff to Slack, email or helpdesk",
      "Answer review + instant re-training",
      "Full analytics and content gaps",
      "Custom tone and guardrails",
    ],
    featured: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Scale",
    monthly: 499,
    yearly: 399,
    blurb: "For regulated, multilingual, high-volume operations.",
    conversations: "Unlimited, fair-use",
    features: [
      "SSO / SAML and audit log",
      "EU or US data residency",
      "99.9% uptime SLA",
      "Dedicated answer review",
      "Named success engineer",
    ],
    featured: false,
    cta: "Talk to sales",
  },
]

export const TESTIMONIALS = [
  {
    quote:
      "We turned it on for the weekend queue and came back to 71% of tickets already resolved, correctly, with citations. The scariest part was how uneventful it was.",
    name: "Aisha Rahman",
    role: "Head of Support, Fieldnotes",
    initials: "AR",
  },
  {
    quote:
      "The content-gap report alone paid for the year. It told us exactly which three articles to write, and deflection jumped another nine points.",
    name: "Tomas Verhoeven",
    role: "COO, Atlas Freight",
    initials: "TV",
  },
  {
    quote:
      "Our German and Japanese customers get the same quality answer as our English ones. One bot, one tone guide, forty-two languages.",
    name: "Priya Nandakumar",
    role: "VP Customer Experience, Verda",
    initials: "PN",
  },
]

export const FAQS = [
  {
    q: "How long until it's actually live?",
    a: "Median is six hours from signup to first resolved conversation. Indexing a typical help centre takes about 12 minutes; the longer part is your answer review, and most teams do it in a single afternoon with coffee.",
  },
  {
    q: "Will it invent answers?",
    a: "No. Replies are generated only from passages retrieved out of your own content, and each one carries a citation. You set a confidence floor — anything under it triggers an honest \"I'm not certain\" and an escalation instead of a guess. Corrections re-train the model instantly.",
  },
  {
    q: "What happens when it can't help?",
    a: "It hands off. Low confidence, sensitive topics, or an annoyed tone all route to a human — with the transcript, a summary, customer context and a suggested reply. The customer never repeats themselves.",
  },
  {
    q: "Where does our data live?",
    a: "SOC 2 Type II, GDPR compliant, encrypted in transit and at rest. Scale customers choose EU or US residency, set their own retention window, sign a DPA, and can purge every transcript with one click. Your content is never used to train shared models.",
  },
  {
    q: "Does it work with our existing helpdesk?",
    a: "Yes — that's the normal setup. Native connectors for Zendesk, Intercom, HubSpot and Salesforce, plus Slack, WhatsApp, Telegram and Shopify. dedbot sits in front, deflects the routine volume, and files the rest as properly structured tickets.",
  },
  {
    q: "Can we control how it sounds?",
    a: "Pick a tone preset or paste a page describing how your brand speaks. Set answer length, emoji policy, formality and hard rules about what it must never say. Same voice, applied consistently across all 42 languages.",
  },
]
