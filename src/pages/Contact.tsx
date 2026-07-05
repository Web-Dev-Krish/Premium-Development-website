import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LeadForm from '../components/LeadForm';
import Footer from '../components/Footer';
import PageSkeleton from '../components/PageSkeleton';

export default function Contact() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const settingsRes = await fetch('/api/site-settings');
      const settingsData = await settingsRes.json();
      setSettings(settingsData && typeof settingsData === 'object' ? settingsData : {});
    } catch (err) {
      console.error('Contact page fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
    document.title = 'Start Your Project | Devsiy';
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-white/20">
      <Navbar settings={settings} variant="contact" />
      <div className="pt-[72px]">
        <LeadForm settings={settings} />
      </div>
      <Footer settings={settings} />
    </div>
  );
}
