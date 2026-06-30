import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function Founders() {
  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    fetch('/api/founders')
      .then((r) => r.json())
      .then((data) => { setFounders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="founders" className="py-24 md:py-32" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">THE MINDS</p>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Meet the <span className="italic font-serif">founders.</span></h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col md:flex-row gap-6 items-center p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border border-white/10 shrink-0">
                  {founder.image_url ? (
                    <img src={founder.image_url} alt={founder.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500 text-2xl font-light">
                      {founder.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-xs text-neutral-500 tracking-widest mb-1 uppercase">{founder.role}</p>
                  <h3 className="text-2xl text-white font-light mb-1">{founder.name}</h3>
                  <p className="text-sm text-neutral-400 mb-3">{founder.title}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{founder.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
