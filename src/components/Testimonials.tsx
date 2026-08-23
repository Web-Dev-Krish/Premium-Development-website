import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote, Star } from 'lucide-react';

// Sample placeholder reviews — swap these out with real client testimonials later.
const testimonials = [
  {
    name: 'Rohit Malhotra',
    role: 'Founder, Urban Kicks',
    initial: 'R',
    rating: 5,
    quote: 'Within three weeks of launching our new site, inbound leads doubled. The contact form actually routes to the right person on our team now — something our old site never did.',
  },
  {
    name: 'Ananya Deshpande',
    role: 'Marketing Head, Northlane Realty',
    initial: 'A',
    rating: 5,
    quote: 'We used to lose leads because no one saw the form submissions in time. Now every enquiry pings us instantly by email, and follow-up happens the same day.',
  },
  {
    name: 'Kunal Shah',
    role: 'Co-founder, Fitcore Studios',
    initial: 'K',
    rating: 5,
    quote: "The team understood that we didn't just want a pretty website — we wanted a site that brought in members. That's exactly what we got.",
  },
  {
    name: 'Priyanka Nair',
    role: 'Operations Lead, Clearpath Logistics',
    initial: 'P',
    rating: 4,
    quote: 'Clean process, clear timelines, and a site that finally converts. Our sales team no longer has to chase cold leads — the good ones come to us.',
  },
  {
    name: 'Vikram Oberoi',
    role: 'CEO, Oberoi & Sons Interiors',
    initial: 'V',
    rating: 5,
    quote: 'Every step of the build was communicated clearly. The automation behind the contact form alone has saved us hours a week.',
  },
  {
    name: 'Sneha Kapoor',
    role: 'Founder, GlowLab Skincare',
    initial: 'S',
    rating: 5,
    quote: 'Our old website looked fine but generated zero leads. This one is built around getting people to actually reach out — and it shows in the numbers.',
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">WHAT CLIENTS SAY</p>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Results, in their <span className="italic font-serif">own words.</span></h2>
          <p className="text-neutral-400 max-w-xl mx-auto">Sample testimonials shown below — replace with real client feedback anytime from the codebase.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <Quote className="w-6 h-6 text-neutral-600 mb-4" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < t.rating ? 'text-white fill-white' : 'text-neutral-700'}`}
                  />
                ))}
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 text-sm font-light shrink-0">
                  {t.initial}
                </div>
                <div>
                  <p className="text-white text-sm font-light">{t.name}</p>
                  <p className="text-neutral-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
