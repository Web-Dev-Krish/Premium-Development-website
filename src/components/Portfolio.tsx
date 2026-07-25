import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye } from 'lucide-react';
import SafeImage from './SafeImage';
import Skeleton from './Skeleton';
import WebsitePreviewModal from './WebsitePreviewModal';

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; url: string; title: string }>({ isOpen: false, url: '', title: '' });
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
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
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
              {filtered.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/30"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <SafeImage
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-neutral-500 mb-2 tracking-wider">{project.categories?.name || 'Project'}</p>
                    <h3 className="text-xl text-white font-light mb-2">{project.title}</h3>
                    <p className="text-neutral-400 text-sm line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex gap-3">
                      {project.project_url && (
                        <>
                          <button
                            onClick={() => setPreviewModal({ isOpen: true, url: project.project_url, title: project.title })}
                            className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-300 transition-colors"
                          >
                            Preview <Eye className="w-3 h-3" />
                          </button>
                          <a href={project.project_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white hover:text-neutral-300 transition-colors">
                            Visit Live <ExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <WebsitePreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, url: '', title: '' })}
        url={previewModal.url}
        title={previewModal.title}
      />
    </section>
  );
}
