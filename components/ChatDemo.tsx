import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Check, Sparkles } from "lucide-react"
import { EASE } from "./primitives"

interface Line {
  role: "visitor" | "bot"
  text: string
}

const SCRIPT: Line[] = [
  { role: "visitor", text: "where's my order #4821?" },
  {
    role: "bot",
    text: "It left the Rotterdam hub at 07:42 and lands Thursday before 18:00. Want me to resend the tracking link?",
  },
  { role: "visitor", text: "yes please" },
  { role: "bot", text: "Sent to aisha@fieldnotes.io. Anything else I can take off your plate?" },
  { role: "visitor", text: "that's all, thanks" },
  { role: "bot", text: "Any time. Have a good one. ✦" },
]

export default function ChatDemo() {
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)
  const [resolved, setResolved] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    const timers: number[] = []
    const push = (fn: () => void, ms: number) =>
      timers.push(window.setTimeout(() => !cancelled && fn(), ms))

    if (visible < SCRIPT.length) {
      const next = SCRIPT[visible]
      if (next.role === "bot") {
        setTyping(true)
        push(() => {
          setTyping(false)
          setVisible((v) => v + 1)
        }, 1100 + next.text.length * 11)
      } else {
        push(() => setVisible((v) => v + 1), 1500)
      }
    } else if (!resolved) {
      push(() => setResolved(true), 700)
    } else {
      push(() => {
        setVisible(0)
        setResolved(false)
        setTick((t) => t + 1)
      }, 3600)
    }

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [visible, resolved, tick])

  return (
    <div className="relative isolate w-full">
      <motion.div
        initial={{ opacity: 0, y: 32, rotate: -1.2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
        className="relative overflow-hidden rounded-[24px] border border-line bg-paper shadow-[0_30px_80px_-30px_rgba(16,16,16,0.35)] sm:rounded-[28px] sm:shadow-[0_40px_100px_-40px_rgba(16,16,16,0.35)]"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink">
              <Sparkles className="h-4 w-4 text-paper" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-medium leading-none sm:text-[13px]">
                dedbot · Fieldnotes
              </p>
              <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" /> online
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-line-2" />
            <span className="h-2 w-2 rounded-full bg-line-2" />
            <span className="h-2 w-2 rounded-full bg-line-2" />
          </div>
        </div>

        {/* thread — flex-1 on lg+ so it fills the vertical hero space cleanly */}
        <div className="hairline-grid flex h-[280px] justify-end bg-paper-2/60 px-4 py-4 sm:h-[320px] sm:px-5 sm:py-5 lg:h-[300px] xl:h-[340px]">
          <div className="flex w-full flex-col justify-end gap-2.5">
            <AnimatePresence initial={false}>
              {SCRIPT.slice(0, visible).map((line, i) => (
                <motion.div
                  key={`${tick}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className={
                    "max-w-[88%] rounded-2xl px-3.5 py-2 text-[12.5px] leading-snug sm:max-w-[86%] sm:px-4 sm:py-2.5 sm:text-[13.5px] " +
                    (line.role === "visitor"
                      ? "ml-auto rounded-br-md bg-ink text-paper"
                      : "mr-auto rounded-bl-md border border-line bg-paper text-ink-2")
                  }
                >
                  {line.text}
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex w-fit items-center gap-1.5 self-start rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3.5"
                >
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-ink-soft"
                      animate={{ opacity: [0.25, 1, 0.25], y: [0, -2.5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.14 }}
                    />
                  ))}
                </motion.div>
              )}

              {resolved && (
                <motion.div
                  key="resolved"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="mt-1 inline-flex w-fit items-center gap-2 self-start rounded-full border border-accent/25 bg-accent-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent"
                >
                  <Check className="h-3 w-3" /> resolved · no human needed · 11s
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* faux input */}
        <div className="flex items-center justify-between border-t border-line px-4 py-3.5 sm:px-5 sm:py-4">
          <span className="text-[12.5px] text-ink-soft/70 sm:text-[13px]">Type a message…</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink">
            <ArrowUpRight className="h-4 w-4 rotate-45 text-paper" />
          </span>
        </div>
      </motion.div>

      {/* floating deflection — desktop only */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: EASE }}
        className="pointer-events-none absolute -left-5 top-[28%] hidden rounded-2xl border border-line bg-paper px-4 py-3 shadow-[0_24px_60px_-30px_rgba(16,16,16,0.35)] xl:block 2xl:-left-8"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          deflection
        </p>
        <p className="mt-1 text-2xl font-medium tracking-[-0.03em]">71.4%</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.15, ease: EASE }}
        className="pointer-events-none absolute -right-4 bottom-16 hidden rounded-2xl border border-line bg-paper px-4 py-3 shadow-[0_24px_60px_-30px_rgba(16,16,16,0.35)] xl:block 2xl:-right-7"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          queue now
        </p>
        <p className="mt-1 text-2xl font-medium tracking-[-0.03em]">0 waiting</p>
      </motion.div>
    </div>
  )
}
