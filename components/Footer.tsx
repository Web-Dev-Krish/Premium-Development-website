import { ArrowUpRight } from "lucide-react"
import { useChat } from "../lib/chat"

const COLUMNS: { title: string; links: string[] }[] = [
  {
    title: "Product",
    links: ["Chatbots", "Knowledge sync", "Human handoff", "Analytics", "Voice & tone"],
  },
  {
    title: "Channels",
    links: ["Web widget", "Slack", "WhatsApp", "In-app API", "Email"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Security", "Status", "Changelog"],
  },
  {
    title: "Resources",
    links: ["Docs", "Migration guide", "ROI calculator", "Support", "Contact"],
  },
]

export default function Footer({ settings }: { settings?: Record<string, string> }) {
  const { openChat } = useChat()

  return (
    <footer className="border-t border-line bg-paper mt-auto">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:py-16 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-8 lg:py-20">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[15px] font-medium lowercase tracking-[-0.02em]">
                devsiy
              </span>
            </div>
            <p className="mt-5 max-w-[34ch] text-[13.5px] leading-relaxed text-ink-soft sm:text-[14px]">
              {settings?.footer_tagline || 'We design and build websites, lead-generation systems, and automation that help businesses win more customers.'}
            </p>
            <button
              onClick={openChat}
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-[12.5px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink sm:mt-7 sm:text-[13px]"
            >
              Chat with us
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {col.title}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={openChat}
                      className="text-[13px] text-ink-2 transition-colors hover:text-accent sm:text-[13.5px]"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:py-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft sm:text-[10.5px]">
            © {new Date().getFullYear()} devsiy
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft sm:gap-x-6 sm:text-[10.5px]">
            <a href="/admin/login" className="transition-colors hover:text-ink">Admin Login</a>
            <span className="transition-colors hover:text-ink">Privacy</span>
            <span className="transition-colors hover:text-ink">Terms</span>
            <span className="transition-colors hover:text-ink">DPA</span>
            <span className="flex items-center gap-2 text-mint">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" /> all systems live
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden px-5 sm:px-8">
        <p className="select-none bg-gradient-to-b from-ink/[0.09] to-ink/[0.015] bg-clip-text text-center font-sans text-[clamp(3.5rem,17vw,15rem)] font-semibold leading-[0.78] tracking-[-0.055em] text-transparent">
          devsiy
        </p>
      </div>
    </footer>
  )
}
