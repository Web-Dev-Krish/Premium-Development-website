import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, Crown } from 'lucide-react';

export default function HostingPricing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    fetch('/api/hosting-plans')
      .then((r) => r.json())
      .then((data) => { setPlans(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="hosting" className="py-24 md:py-32 bg-neutral-900/20" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">HOSTING</p>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Reliable hosting, <span className="italic font-serif">effortless.</span></h2>
          <p className="text-neutral-400 max-w-xl mx-auto">Premium hosting solutions designed for speed, security, and peace of mind.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border ${plan.is_popular ? 'border-white bg-white/5' : 'border-white/10 bg-white/[0.02]'} flex flex-col`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 bg-white text-neutral-950 text-xs font-medium rounded-full">
                    <Crown className="w-3 h-3" /> POPULAR
                  </div>
                )}
                <h3 className="text-xl text-white font-light mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-light text-white">{plan.price}</span>
                  <span className="text-neutral-500 text-sm">/{plan.duration}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {(plan.features || []).map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                      <Check className="w-4 h-4 text-white mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`block text-center py-3 rounded-xl text-sm transition-colors ${plan.is_popular ? 'bg-white text-neutral-950 hover:bg-neutral-200' : 'border border-white/20 text-white hover:bg-white/5'}`}
                >
                  Get Started
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
