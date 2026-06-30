import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Gem, Shield, Clock, Headphones } from 'lucide-react';

const reasons = [
  { icon: Gem, title: 'Quality Over Quantity', desc: 'We take on limited projects to ensure every detail receives the attention it deserves.' },
  { icon: Shield, title: 'Built to Last', desc: 'Clean code, robust architecture, and scalable solutions that grow with your business.' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'Transparent timelines and disciplined execution. Your deadlines are non-negotiable.' },
  { icon: Headphones, title: 'White-Glove Support', desc: 'Direct access to our team from concept to launch and beyond.' },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 md:py-32 bg-neutral-900/20" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">WHY DEVSIY</p>
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              We don't just build websites.<br />
              <span className="italic font-serif">We build trust.</span>
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-8">
              In a world of quick fixes and cookie-cutter templates, Devsiy stands for craftsmanship.
              Our approach is deliberate, our standards are high, and our commitment to your success is absolute.
            </p>
            <a href="#contact" className="inline-flex items-center px-6 py-3 border border-white/20 rounded-full text-sm text-white hover:bg-white hover:text-neutral-950 transition-all">
              Discuss Your Project
            </a>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-white/10 bg-neutral-950"
              >
                <reason.icon className="w-6 h-6 text-white mb-4" />
                <h3 className="text-lg text-white mb-2 font-light">{reason.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{reason.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
