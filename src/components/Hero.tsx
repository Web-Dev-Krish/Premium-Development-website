import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MessageSquareDot } from 'lucide-react';
import ChatDemo from './ChatDemo';
import { EASE } from './primitives';
import { useChat } from '../lib/chat';

export default function Hero({ settings }: { settings: Record<string, string> }) {
  const { openChat } = useChat();

  return (
    <section
      id="top"
      className="relative flex w-full items-center overflow-hidden pt-[90px] sm:pt-[90px] lg:min-h-[85vh] lg:min-h-[85svh] lg:pt-[72px]"
    >
      {/* dedbot light theme backdrop */}
      <div
        className="hairline-grid mask-radial pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 top-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(55,52,240,0.10),transparent_65%)] blur-2xl sm:h-[520px] sm:w-[520px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-[18%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(15,138,95,0.10),transparent_65%)] blur-2xl sm:h-[460px] sm:w-[460px]"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-[67px] hidden h-px bg-line/60 sm:top-[71px] lg:top-[71px] lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-8 px-5 pb-10 pt-2 sm:px-8 sm:gap-10 sm:pb-14 sm:pt-4 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-10 lg:pt-[20px] lg:pb-12">
        
        {/* copy column */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-paper-2/70 py-1.5 pl-2 pr-4 backdrop-blur mb-4"
          >
            <span className="shrink-0 rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper">
              <Sparkles className="w-3 h-3 inline mr-1" /> NEW
            </span>
            <span className="truncate text-[12px] text-ink-2 sm:text-[12.5px]">
              {settings?.hero_tagline || 'WEBSITES BUILT TO GET YOU LEADS'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="font-medium leading-[1] tracking-[-0.042em]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
          >
            <span className="block text-ink">We build websites</span>
            <span className="block text-ink-soft">that turn visitors into </span>
            <span className="block pt-2 italic font-display text-accent" style={{ fontSize: "clamp(2.2rem, 5.5vw, 5rem)" }}>
              customers.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="mt-7 max-w-[44ch] text-[15.5px] leading-relaxed text-ink-soft sm:mt-9 sm:max-w-[46ch] sm:text-[17.5px]"
          >
            {settings?.hero_subtitle || 'We design, build, and automate websites that generate real leads for your business – not just good looks.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            className="mt-9 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
          >
            <Link
              to="/contact"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-7 py-4 text-[14.5px] font-medium text-paper transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-16px_rgba(16,16,16,0.6)] sm:w-auto sm:justify-start"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <button
              onClick={openChat}
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-line-2 px-7 py-4 text-[14.5px] font-medium text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-ink sm:w-auto sm:justify-start"
            >
              <MessageSquareDot className="h-4 w-4 text-accent" />
              Talk to our bot
            </button>
          </motion.div>
        </div>

        {/* demo column */}
        <div className="order-1 mx-auto w-full max-w-[440px] lg:order-2 lg:col-span-5 lg:max-w-none">
          <ChatDemo />
        </div>
      </div>
    </section>
  );
}
