import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, Play, Film, Image as ImageIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SafeImage from '../components/SafeImage';
import PageSkeleton from '../components/PageSkeleton';

export default function RecentWork() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [settingsRes, itemsRes] = await Promise.all([
        fetch('/api/site-settings'),
        fetch('/api/recent-work'),
      ]);
      const settingsData = await settingsRes.json();
      const itemsData = await itemsRes.json();

      setSettings(settingsData && typeof settingsData === 'object' ? settingsData : {});
      setItems(Array.isArray(itemsData) ? itemsData : []);
    } catch (err) {
      console.error('RecentWork fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
    document.title = 'Recent Work | Devsiy';
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-white/20">
      <Navbar settings={settings} />

      <main className="pt-28 pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest text-neutral-300 mb-6">
              <Film className="w-3.5 h-3.5" /> RECENT WORK & SHOWCASE
            </div>
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
              Crafted with <span className="italic font-serif">precision.</span>
            </h1>
            <p className="text-neutral-400 text-base md:text-lg">
              Explore our latest video visualizers, design showcases, and interactive digital builds.
            </p>
          </motion.div>

          {/* Grid of Recent Work */}
          {items.length === 0 ? (
            <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/[0.01]">
              <p className="text-neutral-500 text-sm">No recent work items uploaded yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40 flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-xl"
                >
                  {/* Media Container */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-950">
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 bg-neutral-950/80 backdrop-blur-md border border-white/10 text-white text-xs rounded-full">
                      {item.media_type === 'video' ? <Film className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                      <span className="capitalize">{item.media_type}</span>
                    </div>

                    {item.media_type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={item.media_url}
                          controls
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      </div>
                    ) : (
                      <SafeImage
                        src={item.media_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl text-white font-light mb-2">{item.title}</h3>
                      {item.description && (
                        <p className="text-neutral-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Social Media Buttons Section */}
                    {item.show_social_buttons && (item.show_instagram || item.show_facebook || item.show_youtube) && (
                      <div className="pt-4 border-t border-white/10 mt-auto">
                        <p className="text-[11px] tracking-wider text-neutral-500 mb-3 font-medium uppercase">
                          Connect & View On:
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Instagram Button */}
                          {item.show_instagram && item.instagram_url && (
                            <a
                              href={item.instagram_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-400 text-xs font-medium hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white transition-all transform hover:-translate-y-0.5 shadow-sm"
                            >
                              <Instagram className="w-4 h-4" />
                              <span>Instagram</span>
                            </a>
                          )}

                          {/* Facebook Button */}
                          {item.show_facebook && item.facebook_url && (
                            <a
                              href={item.facebook_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-0.5 shadow-sm"
                            >
                              <Facebook className="w-4 h-4" />
                              <span>Facebook</span>
                            </a>
                          )}

                          {/* YouTube Button */}
                          {item.show_youtube && item.youtube_url && (
                            <a
                              href={item.youtube_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-0.5 shadow-sm"
                            >
                              <Youtube className="w-4 h-4" />
                              <span>YouTube</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
