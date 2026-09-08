import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import LivePreview from './LivePreview';
import Skeleton from './Skeleton';

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/categories'),
      ]);
      const projectsData = await projectsRes.json();
      const categoriesData = await categoriesRes.json();
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Portfolio fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category_id === parseInt(activeCategory));

  return (
    <section id="portfolio" className="py-24 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">SELECTED WORK</p>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6">Recent <span className="italic font-serif">projects.</span></h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm transition-all border ${activeCategory === 'all' ? 'bg-white text-neutral-950 border-white' : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id.toString())}
              className={`px-5 py-2 rounded-full text-sm transition-all border ${activeCategory === cat.id.toString() ? 'bg-white text-neutral-950 border-white' : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/30'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/30">
                <Skeleton className="aspect-[16/9] w-full rounded-none" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((project, index) => (
                <PortfolioCard key={project.id} project={project} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** Individual portfolio card — loads its iframe only when scrolled into view */
function PortfolioCard({ project, index }: { project: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger: delay each card by 300ms * its position to prevent all loading at once
          const timer = setTimeout(() => setShouldLoad(true), index * 300);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/30 flex flex-col"
    >
      <div className="p-2">
        {shouldLoad ? (
          <LivePreview url={project.project_url} title={project.title} aspectRatio="aspect-[16/9]" />
        ) : (
          <div className="aspect-[16/9] rounded-xl bg-neutral-900/80 border border-white/10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-neutral-500 mb-2 tracking-wider">{project.categories?.name || 'Project'}</p>
          <h3 className="text-xl text-white font-light mb-2">{project.title}</h3>
          <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{project.description}</p>
        </div>
        {project.project_url && (
          <a href={project.project_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-300 transition-colors mt-auto">
            Visit Live <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
