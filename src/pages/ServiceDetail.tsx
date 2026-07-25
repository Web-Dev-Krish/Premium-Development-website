import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, ShoppingBag, Code2, Search, Settings, Smartphone, ArrowLeft, Check, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageSkeleton from '../components/PageSkeleton';
import { getServiceBySlug, services, ServiceData } from '../data/services';

const iconMap: Record<ServiceData['icon'], typeof Palette> = {
  palette: Palette,
  'shopping-bag': ShoppingBag,
  code: Code2,
  smartphone: Smartphone,
  search: Search,
  settings: Settings,
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const service = getServiceBySlug(slug);

  const fetchData = async () => {
    try {
      const settingsRes = await fetch('/api/site-settings');
      const settingsData = await settingsRes.json();
      setSettings(settingsData && typeof settingsData === 'object' ? settingsData : {});
    } catch (err) {
      console.error('Service detail fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
    if (service) {
      document.title = `${service.title} | Devsiy`;
    }
  }, [slug]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!service) {
    return <Navigate to="/" replace />;
  }

  const Icon = iconMap[service.icon];
  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-white/20">
      <Navbar settings={settings} />

      <main className="pt-32 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center mb-8">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
              {service.title}
            </h1>
            <p className="text-neutral-400 text-lg mb-12 max-w-2xl leading-relaxed">
              {service.desc}
            </p>

            <div className="space-y-5 mb-12">
              {service.longDescription.map((para, i) => (
                <p key={i} className="text-neutral-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] mb-12">
              <p className="text-xs tracking-[0.2em] text-neutral-500 mb-6">WHAT'S INCLUDED</p>
              <ul className="space-y-4">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-neutral-300 shrink-0 mt-0.5" />
                    <span className="text-neutral-200 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-950 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Other services */}
          <div className="mt-24 pt-16 border-t border-white/10">
            <p className="text-xs tracking-[0.2em] text-neutral-500 mb-8">EXPLORE MORE SERVICES</p>
            <div className="grid md:grid-cols-3 gap-6">
              {otherServices.map((s) => {
                const OtherIcon = iconMap[s.icon];
                return (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all"
                  >
                    <OtherIcon className="w-6 h-6 text-neutral-300 mb-4 group-hover:text-white transition-colors" />
                    <h3 className="text-white font-light mb-1">{s.title}</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-400 group-hover:text-white transition-colors">
                      Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
