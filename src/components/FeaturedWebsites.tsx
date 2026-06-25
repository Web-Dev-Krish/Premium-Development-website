import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';

export default function FeaturedWebsites() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    fetch('/api/featured-websites')
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">FEATURED</p>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Websites we <span className="italic font-serif">love.</span></h2>
          <p className="text-neutral-400 max-w-xl mx-auto">A curated selection of standout projects that represent our commitment to excellence.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/30"
              >
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs rounded-full">
                  <Star className="w-3 h-3" /> Featured
                </div>
                <div className="aspect-[4/3] overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-600">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-white font-light mb-2">{item.title}</h3>
                  <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{item.description}</p>
                  {item.project_url && (
                    <a href={item.project_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-300 transition-colors">
                      View Project <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
