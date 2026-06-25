import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Palette, ShoppingBag, Code2, Search, Settings, Smartphone } from 'lucide-react';

const services = [
  { icon: Palette, title: 'Website Design', desc: 'Bespoke, visually stunning websites that communicate your brand\'s essence with precision.' },
  { icon: ShoppingBag, title: 'E-commerce Development', desc: 'High-converting online stores on Shopify, WooCommerce, and custom platforms.' },
  { icon: Code2, title: 'Custom Web Apps', desc: 'Scalable applications built with modern stacks tailored to your business logic.' },
  { icon: Smartphone, title: 'UI/UX Design', desc: 'User-centered interfaces that feel intuitive, elegant, and effortless.' },
  { icon: Search, title: 'SEO & Performance', desc: 'Technical optimization that puts your business in front of the right audience.' },
  { icon: Settings, title: 'Maintenance & Support', desc: 'Ongoing care, updates, and hosting management so you stay focused on growth.' },
];

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
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
            >
              <service.icon className="w-8 h-8 text-neutral-300 mb-6 group-hover:text-white transition-colors" />
              <h3 className="text-xl text-white mb-3 font-light">{service.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
