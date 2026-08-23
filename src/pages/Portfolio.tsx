import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import WhyChooseUs from '../components/WhyChooseUs';
import PortfolioGrid from '../components/Portfolio';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import BuildYourProject from '../components/BuildYourProject';
import Footer from '../components/Footer';
import PageSkeleton from '../components/PageSkeleton';

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
    document.title = 'Our Work | Devsiy';
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-white/20">
      <Navbar settings={settings} variant="portfolio" />
      <div className="pt-[72px]">
        <WhyChooseUs />
        <PortfolioGrid />
        <Services />
        <Testimonials />
        <FAQ />
        <BuildYourProject />
      </div>
      <Footer settings={settings} />
    </div>
  );
}
