export type BotReply = {
  text: string
  chips?: string[]
}

export type ChatMessage = {
  id: string
  role: "user" | "bot"
  text: string
  chips?: string[]
}

export const OPENING_MESSAGE: ChatMessage = {
  id: "msg-0",
  role: "bot",
  text: "Hi! I'm Devsiy's AI assistant. We build websites, apps, and AI chatbots that generate real leads. How can I help you today?",
  chips: ["What services do you offer?", "How much does a website cost?", "How do I get a quote?"],
}

export const OPENING_CHIPS = OPENING_MESSAGE.chips!

type Rule = {
  keys: string[]
  reply: BotReply
}

const RULES: Rule[] = [
  {
    keys: ["services", "what do you do", "offer", "app development", "website development", "social media", "ai chatbot"],
    reply: {
      text: "Our primary services are Website Development and App Development. We also offer AI Chatbot Development and Social Media Management.\nOur tech stack includes React, Vite, TypeScript, React Native, Node.js, Next.js, Express.js, Supabase, and Vercel. For mobile apps, we also use Flutter.",
      chips: ["How much does a website cost?", "App development pricing", "How do I get a quote?"],
    },
  },
  {
    keys: ["price", "pricing", "cost", "how much", "website cost", "quote", "static", "dynamic"],
    reply: {
      text: "Our website pricing is highly competitive:\n• Static Website: Starting at $300 + Domain.\n• Dynamic/Interactive Website: Starting at $1000 + Domain.\n• App & Chatbot Development: We offer these at 30% below the market rate.\nWould you like to get a custom quote?",
      chips: ["How do I get a quote?", "What services do you offer?", "Talk to a human"],
    },
  },
  {
    keys: ["quote form", "submit quote", "get a quote", "how to start", "start project", "contact"],
    reply: {
      text: "To get started, simply navigate to our Portfolio or Services page, pick what you need, and click on 'Get Started' or fill out the Contact form with your project details.\nOnce you submit the quote form, our team will review it and reply back to you within 24 hours to discuss timelines and exact pricing.",
      chips: ["What services do you offer?", "Talk to a human"],
    },
  },
  {
    keys: ["tech stack", "technology", "react", "flutter", "next.js", "node.js"],
    reply: {
      text: "We use modern, scalable technologies:\nFrontend: React, Vite, Next.js, TypeScript.\nBackend & DB: Node.js, Express.js, Supabase.\nMobile Apps: React Native and Flutter.\nDeployment: Vercel.",
      chips: ["How much does a website cost?", "How do I get a quote?"],
    },
  },
  {
    keys: ["human", "person", "sales", "someone", "representative", "support team", "email", "call"],
    reply: {
      text: "You can reach out to our team directly through the Contact page. If you submit a query or quote form, we usually reply within 24 hours.",
      chips: ["How do I get a quote?", "What services do you offer?"],
    },
  },
  {
    keys: ["thank", "thanks", "cheers", "nice one", "great", "awesome", "perfect"],
    reply: {
      text: "You're very welcome! Let me know if you need anything else.",
      chips: ["What services do you offer?", "How do I get a quote?"],
    },
  },
  {
    keys: ["bye", "goodbye", "see you", "later", "cya"],
    reply: {
      text: "Goodbye! We're looking forward to helping you build something amazing.",
      chips: ["How do I get a quote?"],
    },
  },
]

const FALLBACK: BotReply = {
  text: "I'm not completely sure about that. Try asking me about our services, pricing, tech stack, or how to get a quote! Or you can reach out via the Contact page.",
  chips: ["What services do you offer?", "How much does a website cost?", "How do I get a quote?"],
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
