import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Target, Users } from 'lucide-react';
import SafeImage from './SafeImage';

interface AboutUsProps {
  settings: Record<string, string>;
}

export default function AboutUs({ settings }: AboutUsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const highlights = [
    { icon: Target, title: 'Purpose-Driven', desc: 'Every line of code and every pixel serves your business goal.' },
    { icon: Award, title: 'Award-Winning Quality', desc: 'We treat each project like a portfolio piece, not a ticket.' },
    { icon: Users, title: 'Client-First Process', desc: 'Transparent communication, milestone-based delivery, and zero surprises.' },
  ];

  return (
    <section id="about" className="py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">ABOUT DEVSIY</p>
            <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
              We believe in <span className="italic font-serif">less but better.</span>
            </h2>
            <div className="space-y-4 text-neutral-400 leading-relaxed mb-8">
              <p>
                {settings?.about_paragraph_1 ||
                  'Devsiy is a premium digital agency focused on designing and developing websites that elevate brands. From high-converting e-commerce stores to bespoke corporate platforms, we build with intention.'}
              </p>
              <p>
                {settings?.about_paragraph_2 ||
                  'Our philosophy is simple: quality over quantity. We partner with a select number of clients each quarter so every project receives the creative and technical excellence it deserves.'}
              </p>
            </div>
            <a
              href="#portfolio"
              className="inline-flex items-center px-6 py-3 border border-white/20 rounded-full text-sm text-white hover:bg-white hover:text-neutral-950 transition-all"
            >
              See Our Work
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            {settings?.banner_image_url ? (
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                <SafeImage
                  src={settings.banner_image_url}
                  alt="Devsiy banner"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-2xl border border-white/10 bg-neutral-900 flex items-center justify-center">
                <span className="text-neutral-600 text-sm">Banner image</span>
              </div>
            )}
            <div className="absolute -bottom-6 -left-6 p-6 rounded-2xl border border-white/10 bg-neutral-950/90 backdrop-blur-md hidden md:block">
              <p className="text-3xl font-light text-white mb-1">50+</p>
              <p className="text-neutral-500 text-xs tracking-wide">PROJECTS DELIVERED</p>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
            >
              <item.icon className="w-6 h-6 text-white mb-4" />
              <h3 className="text-lg text-white font-light mb-2">{item.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
