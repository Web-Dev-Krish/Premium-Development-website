import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowUp, Bot, RotateCcw, Sparkles, X } from "lucide-react"
import { useChat } from "../lib/chat"
import {
  getBotReply,
  OPENING_CHIPS,
  OPENING_MESSAGE,
  typingDelay,
  type ChatMessage,
} from "../lib/chatbot"

const EASE = [0.16, 1, 0.3, 1] as const

let idCounter = 0
const nextId = () => `m-${++idCounter}`

export default function ChatWidget() {
  const { open, toggleChat, closeChat, unread, clearUnread } = useChat()
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING_MESSAGE])
  const [chips, setChips] = useState<string[]>(OPENING_CHIPS)
  const [typing, setTyping] = useState(false)
  const [draft, setDraft] = useState("")

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<number | null>(null)

  /* autoscroll */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages, typing, open])

  /* focus + escape */
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 420)
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeChat()
      }
      window.addEventListener("keydown", onKey)
      return () => {
        window.clearTimeout(id)
        window.removeEventListener("keydown", onKey)
      }
    }
  }, [open, closeChat])

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current) }, [])

  const send = useCallback((raw: string) => {
    const text = raw.trim()
    if (!text) return
    setDraft("")
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text }])
    setTyping(true)

    const reply = getBotReply(text)
    timerRef.current = window.setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { id: nextId(), role: "bot", text: reply.text }])
      setChips(reply.chips ?? OPENING_CHIPS)
    }, typingDelay(reply.text))
  }, [])

  const reset = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setTyping(false)
    setMessages([{ ...OPENING_MESSAGE, id: nextId() }])
    setChips(OPENING_CHIPS)
    inputRef.current?.focus()
  }, [])

  return (
    <>
      {/* ---------------------------------------------------------- panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="fixed inset-x-3 bottom-[88px] z-50 flex h-[calc(100dvh-120px)] max-h-[640px] w-[calc(100vw-1.5rem)] origin-bottom-right flex-col overflow-hidden rounded-[26px] border border-neutral-800 bg-neutral-900 shadow-2xl sm:inset-x-auto sm:bottom-[96px] sm:right-6 sm:w-[386px]"
          >
            {/* header */}
            <div className="relative flex items-center justify-between bg-black px-5 py-4 border-b border-neutral-800">
              <div className="relative flex items-center gap-3">
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-emerald-500" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium leading-none text-white">
                    devbot
                  </p>
                  <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/50">
                    replies instantly · 24/7
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={reset}
                  aria-label="Restart conversation"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={closeChat}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto bg-neutral-900/50 px-4 py-5"
            >
              <div className="mb-4 flex items-center justify-center">
                <span className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-neutral-400">
                  Devsiy AI Assistant
                </span>
              </div>

              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className={
                      m.role === "user"
                        ? "ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-2.5 text-[13.5px] leading-relaxed text-black"
                        : "mr-auto w-fit max-w-[88%] rounded-2xl rounded-bl-md border border-neutral-800 bg-neutral-900 px-4 py-3 text-[13.5px] leading-relaxed text-white shadow-lg"
                    }
                  >
                    {m.text.split("\n").map((line, i) => (
                      <span key={i} className={i > 0 ? "block pt-2" : "block"}>
                        {line}
                      </span>
                    ))}
                  </motion.div>
                ))}

                {typing && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-neutral-800 bg-neutral-900 px-4 py-3.5"
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-neutral-500"
                        animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.13 }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* chips */}
            <div className="no-scrollbar flex shrink-0 gap-2 overflow-x-auto border-t border-neutral-800 bg-neutral-900 px-4 py-3">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="shrink-0 rounded-full border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-[12px] text-neutral-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:text-white whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(draft)
              }}
              className="flex shrink-0 items-center gap-2 border-t border-neutral-800 bg-neutral-900 px-3 py-3"
            >
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask about websites, apps, ads..."
                className="min-w-0 flex-1 rounded-full bg-neutral-800 px-4 py-3 text-[13.5px] text-white placeholder:text-neutral-500 outline-none focus:ring-1 focus:ring-neutral-600"
              />
              <motion.button
                type="submit"
                aria-label="Send message"
                whileTap={{ scale: 0.92 }}
                disabled={!draft.trim()}
                className={
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 " +
                  (draft.trim()
                    ? "bg-white text-black hover:shadow-lg"
                    : "bg-neutral-800 text-neutral-500")
                }
              >
                <ArrowUp className="h-4 w-4" />
              </motion.button>
            </form>

            <div className="flex shrink-0 items-center justify-center gap-1.5 border-t border-neutral-800 bg-neutral-900 py-2.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-neutral-500">
              <Sparkles className="h-3 w-3 text-neutral-400" />
              Trained for Devsiy Services
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------- launcher */}
      <motion.button
        onClick={() => {
          toggleChat()
          clearUnread()
        }}
        aria-label="Open chat with devbot"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-4 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-[20px] bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[62px] sm:w-[62px] sm:rounded-[22px]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <X className="h-6 w-6 text-black" />
            </motion.span>
          ) : (
            <motion.span
              key="bot"
              initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <Bot className="h-7 w-7 text-black" />
            </motion.span>
          )}
        </AnimatePresence>

        {unread && !open && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 font-mono text-[10px] text-white">
            1
          </span>
        )}
        {unread && !open && (
          <span className="absolute inset-0 animate-ping rounded-[22px] bg-white/40" />
        )}
      </motion.button>

      <AnimatePresence>
        {!open && (
          <motion.button
            key="nudge"
            onClick={() => {
              clearUnread()
              toggleChat()
            }}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 14 }}
            transition={{ duration: 0.5, delay: 1.6, ease: EASE }}
            className="fixed bottom-7 right-[92px] z-50 hidden items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-[12.5px] font-medium text-white shadow-lg transition-colors hover:border-neutral-600 xl:flex xl:bottom-8 xl:right-[104px]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Chat with devbot
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
