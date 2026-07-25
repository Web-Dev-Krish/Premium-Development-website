import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedWebsites from '../components/FeaturedWebsites';
import Founders from '../components/Founders';
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import FAQ from '../components/FAQ';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import SkinEffects from '../components/SkinEffects';
import PageSkeleton from '../components/PageSkeleton';

export default function Home() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [skins, setSkins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [settingsRes, skinsRes] = await Promise.all([
        fetch('/api/site-settings'),
        fetch('/api/website-skins'),
      ]);
      const settingsData = await settingsRes.json();
      const skinsData = await skinsRes.json();
      setSettings(settingsData && typeof settingsData === 'object' ? settingsData : {});
      setSkins(Array.isArray(skinsData) ? skinsData : []);
    } catch (err) {
      console.error('Home fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.title = 'Devsiy | Websites & Lead Generation Systems for Businesses';
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-white/20">
      <SkinEffects skins={skins} />
      <Navbar settings={settings} />
      <Hero settings={settings} />
      <FeaturedWebsites />
      <Founders />
      <AboutUs settings={settings} />
      <Services />
      <FAQ />
      <LeadForm settings={settings} />
      <Footer settings={settings} />
    </div>
  );
}
