import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import WhyChooseUs from '../components/WhyChooseUs';
import PortfolioGrid from '../components/Portfolio';
import Services from '../components/Services';
import FAQ from '../components/FAQ';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';

export default function PortfolioPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const settingsRes = await fetch('/api/site-settings');
      const settingsData = await settingsRes.json();
      setSettings(settingsData && typeof settingsData === 'object' ? settingsData : {});
    } catch (err) {
      console.error('Portfolio page fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Scroll to top whenever this page mounts
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-white/20">
      <Navbar settings={settings} variant="portfolio" />
      <div className="pt-[72px]">
        <WhyChooseUs />
        <PortfolioGrid />
        <Services />
        <FAQ />
        <LeadForm settings={settings} />
      </div>
      <Footer settings={settings} />
    </div>
  );
}
