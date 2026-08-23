import { LOGOS, METRICS } from "../lib/content"
import { CountUp, Reveal } from "./primitives"

export function LogoMarquee() {
  return (
    <section className="border-y border-line bg-paper-2/50">
      <div className="mx-auto max-w-[1280px] px-5 py-7 sm:px-8 sm:py-8">
        <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.24em] text-ink-soft">
          Answering for 1,400+ support teams
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)] sm:mt-7">
          <div className="animate-marquee flex w-max items-center gap-10 pr-10 sm:gap-14 sm:pr-14">
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="whitespace-nowrap font-mono text-[12px] tracking-[0.16em] text-ink/45 transition-colors duration-300 hover:text-ink sm:text-[13px] sm:tracking-[0.18em]"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Metrics() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
      <div className="grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-y-0">
        {METRICS.map((m, i) => (
          <Reveal
            key={m.label}
            delay={i * 0.08}
            className="px-2 py-8 sm:px-6 sm:py-9 lg:px-8"
          >
            <p className="text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-none tracking-[-0.045em]">
              <CountUp to={m.value} suffix={m.suffix} decimals={m.decimals ?? 0} />
            </p>
            <p className="mt-3 max-w-[24ch] text-[12.5px] leading-relaxed text-ink-soft sm:mt-4 sm:text-[13.5px]">
              {m.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
