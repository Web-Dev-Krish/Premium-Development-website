import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedWebsites from '../components/FeaturedWebsites';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import Founders from '../components/Founders';
import FAQ from '../components/FAQ';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import AboutUs from '../components/AboutUs';
import SuccessModal from '../components/SuccessModal';
import SkinEffects from '../components/SkinEffects';

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

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-white/20">
      <SkinEffects skins={skins} />
      <Navbar settings={settings} />
      <Hero settings={settings} />
      <FeaturedWebsites />
      <Founders />
      <WhyChooseUs />
      <AboutUs settings={settings} />
      <Services />
      <LeadForm settings={settings} />
      <FAQ />
      <SuccessModal/>
      <Footer settings={settings} />
    </div>
  );
}
