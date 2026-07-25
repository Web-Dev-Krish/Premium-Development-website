import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Palette, ShoppingBag, Code2, Search, Settings, Smartphone, ArrowRight } from 'lucide-react';
import { services, ServiceData } from '../data/services';

const iconMap: Record<ServiceData['icon'], typeof Palette> = {
  palette: Palette,
  'shopping-bag': ShoppingBag,
  code: Code2,
  smartphone: Smartphone,
  search: Search,
  settings: Settings,
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">WHAT WE DO</p>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Services crafted for <span className="italic font-serif">impact.</span></h2>
          <p className="text-neutral-400 max-w-xl mx-auto">Every project is an opportunity to build something remarkable. No templates. No shortcuts.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group block h-full p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all"
                >
                  <Icon className="w-8 h-8 text-neutral-300 mb-6 group-hover:text-white transition-colors" />
                  <h3 className="text-xl text-white mb-3 font-light">{service.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">{service.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300 group-hover:text-white transition-colors">
                    Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
