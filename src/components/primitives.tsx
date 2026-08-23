import { useEffect, useRef, type ReactNode } from "react"
import { animate, motion, useInView } from "framer-motion"

type Bezier = [number, number, number, number]

export const EASE: Bezier = [0.16, 1, 0.3, 1]
export const EASE_SOFT: Bezier = [0.25, 0.6, 0.3, 1]

/* ------------------------------------------------------------------ Logo */

export function Logo({ className = "h-8 w-8", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="18" fill={inverted ? "#fbfaf8" : "#101010"} />
      <path
        d="M32 15c-10 0-18 6.6-18 14.8 0 4.6 2.6 8.7 6.6 11.3-.3 2.4-1.3 4.5-2.8 6.2 3.4-.3 6.5-1.6 8.9-3.4 1.7.4 3.5.6 5.3.6 10 0 18-6.6 18-14.8S42 15 32 15z"
        fill={inverted ? "#101010" : "#fbfaf8"}
      />
      <circle cx="25.6" cy="29.6" r="2.7" fill={inverted ? "#fbfaf8" : "#101010"} />
      <circle cx="38.4" cy="29.6" r="2.7" fill={inverted ? "#fbfaf8" : "#101010"} />
    </svg>
  )
}

/* --------------------------------------------------------------- Reveal */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-90px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------- Eyebrow */

export function Eyebrow({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`h-1.5 w-1.5 rounded-full ${tone === "dark" ? "bg-paper" : "bg-accent"}`} />
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.22em] ${
          tone === "dark" ? "text-paper/60" : "text-ink-soft"
        }`}
      >
        {children}
      </span>
    </div>
  )
}

/* -------------------------------------------------------- SectionHeading */

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  tone = "light",
  className = "",
}: {
  eyebrow: string
  title: ReactNode
  body?: string
  align?: "left" | "center"
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <div
      className={`${
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"
      } ${className}`}
    >
      <Reveal>
        <div className={align === "center" ? "flex justify-center" : ""}>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-6 text-balance font-sans text-[clamp(2rem,4.4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.035em] ${
            tone === "dark" ? "text-paper" : "text-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={0.16}>
          <p
            className={`mt-5 max-w-xl text-[17px] leading-relaxed ${
              align === "center" ? "mx-auto" : ""
            } ${tone === "dark" ? "text-paper/60" : "text-ink-soft"}`}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  )
}

/* --------------------------------------------------------------- Button */

export function Button({
  children,
  variant = "solid",
  className = "",
  onClick,
  type = "button",
}: {
  children: ReactNode
  variant?: "solid" | "outline" | "ghost" | "paper"
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
}) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium tracking-[-0.01em] transition-all duration-300"

  const styles: Record<string, string> = {
    solid: "bg-ink text-paper hover:bg-ink-2 hover:shadow-[0_14px_40px_-14px_rgba(16,16,16,0.55)] hover:-translate-y-0.5",
    outline: "border border-line-2 text-ink hover:border-ink hover:-translate-y-0.5 bg-transparent",
    ghost: "text-ink hover:text-accent",
    paper: "bg-paper text-ink hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-14px_rgba(251,250,248,0.4)]",
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </motion.button>
  )
}

/* -------------------------------------------------------------- CountUp */

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  to: number
  suffix?: string
  prefix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, to, suffix, prefix, decimals])

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>
}

/* ------------------------------------------------------------ TypeRow --- */

export function Serif({ children }: { children: ReactNode }) {
  return <em className="font-display font-normal italic tracking-[-0.01em]">{children}</em>
}
