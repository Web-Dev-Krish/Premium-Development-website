export type ChatRole = "bot" | "user"

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
}

export interface BotReply {
  text: string
  chips?: string[]
}

interface Rule {
  keys: string[]
  reply: BotReply
}

export const OPENING_MESSAGE: ChatMessage = {
  id: "seed",
  role: "bot",
  text:
    "Hi! I'm devbot, Devsiy's AI assistant.\nI can tell you about our Website Development, Mobile App Development, Google & Meta Ads, or AI Chatbot services.\nHow can I help you grow your business today?",
}

export const OPENING_CHIPS = [
  "Website Development",
  "Mobile App Development",
  "Google & Meta Ads",
  "AI Chatbots",
  "Pricing & Contact",
]

const RULES: Rule[] = [
  {
    keys: ["hello", "hi", "hey", "yo", "good morning", "good afternoon", "sup", "hallo"],
    reply: {
      text: "Hello! Welcome to Devsiy. Are you looking to build a website, a mobile app, scale with ads, or automate with AI?",
      chips: ["Websites", "Mobile Apps", "Ads", "AI Chatbots"],
    },
  },
  {
    keys: ["website", "web dev", "web design", "site", "landing page", "ecommerce"],
    reply: {
      text: "We craft bespoke, modern websites optimized for speed, aesthetics, and maximum conversion rates.\nFrom sleek corporate sites to scalable web applications, we ensure a seamless user experience across all devices.\nWant to know about our tech stack or process?",
      chips: ["Tech Stack", "Pricing & Contact", "Mobile Apps"],
    },
  },
  {
    keys: ["mobile", "app", "ios", "android", "react native", "flutter", "smartphone"],
    reply: {
      text: "We build native and cross-platform mobile apps for iOS and Android.\nOur apps are built for speed, scalability, and engagement, handling everything from user onboarding to secure payment gateways and cloud sync.",
      chips: ["Pricing & Contact", "Websites", "AI Chatbots"],
    },
  },
  {
    keys: ["ads", "google", "meta", "facebook", "instagram", "marketing", "roas", "roi", "paid"],
    reply: {
      text: "Our Google & Meta Ads services scale your customer acquisition.\nWe combine granular audience targeting, persuasive ad copy, striking visual assets, and bulletproof conversion tracking to maximize your Return on Ad Spend (ROAS).",
      chips: ["Pricing & Contact", "Websites"],
    },
  },
  {
    keys: ["ai", "bot", "chatbot", "automation", "devbot", "automate"],
    reply: {
      text: "We build custom 24/7 AI conversational agents (just like me!) trained on your business data.\nThey can qualify leads, answer queries, schedule appointments, and seamlessly integrate with your website, WhatsApp, and CRM.",
      chips: ["Pricing & Contact", "Websites", "Mobile Apps"],
    },
  },
  {
    keys: ["tech stack", "technology", "stack", "react", "nextjs", "node"],
    reply: {
      text: "We use modern, high-performance tech stacks including React, Next.js, Node.js, and modern cross-platform frameworks for mobile.\nEvery project is custom-built—no generic templates.",
      chips: ["Websites", "Mobile Apps", "Pricing & Contact"],
    },
  },
  {
    keys: ["price", "pricing", "cost", "quote", "how much", "estimate", "budget"],
    reply: {
      text: "Every project is unique, so we provide custom quotes based on your specific needs and goals.\nLet's get in touch to discuss your vision and we'll give you a detailed estimate.",
      chips: ["Talk to a human", "Websites", "Mobile Apps"],
    },
  },
  {
    keys: ["contact", "human", "talk", "sales", "support", "email", "call", "meet"],
    reply: {
      text: "We'd love to chat! You can reach us at hello@devsiy.in or fill out the contact form on our website to schedule a free consultation.\nOur team usually responds within one business day.",
      chips: ["Websites", "Mobile Apps", "AI Chatbots"],
    },
  },
  {
    keys: ["thank", "thanks", "cheers", "great", "awesome", "perfect", "good"],
    reply: {
      text: "You're welcome! Let me know if you have any other questions about Devsiy's services.",
      chips: ["Websites", "Mobile Apps", "Pricing & Contact"],
    },
  },
  {
    keys: ["bye", "goodbye", "see you", "later"],
    reply: {
      text: "Goodbye! We look forward to helping you build something remarkable.",
      chips: ["Websites", "Mobile Apps", "Google & Meta Ads"],
    },
  },
]

const FALLBACK: BotReply = {
  text: "I'm not exactly sure about that, but our team at Devsiy would be happy to help.\nYou can ask me about our Website Development, Mobile Apps, Google/Meta Ads, or AI Chatbots, or ask to talk to a human.",
  chips: ["Websites", "Mobile Apps", "Talk to a human"],
}

export function getBotReply(rawInput: string): BotReply {
  const input = ` ${rawInput.toLowerCase().replace(/[^a-z0-9\s'?.!-]/g, " ").replace(/\s+/g, " ")} `

  for (const rule of RULES) {
    for (const key of rule.keys) {
      if (input.includes(key)) return rule.reply
    }
  }

  return FALLBACK
}

export function typingDelay(text: string): number {
  return Math.min(2200, 520 + text.length * 11)
}
