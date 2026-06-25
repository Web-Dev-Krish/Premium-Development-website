import { useEffect, useState } from 'react';
import { adminFetch, uploadFile } from '../../lib/utils';

const TEXT_FIELDS = [
  { key: 'hero_tagline', label: 'Hero Tagline', placeholder: 'PREMIUM WEB DESIGN AGENCY' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', placeholder: 'Quality over quantity...' },
  { key: 'about_paragraph_1', label: 'About Us Paragraph 1', placeholder: 'Devsiy is a premium digital agency...', multiline: true },
  { key: 'about_paragraph_2', label: 'About Us Paragraph 2', placeholder: 'Our philosophy is simple...', multiline: true },
  { key: 'mobile_number', label: 'Mobile Number', placeholder: '+91-9876543210' },
  { key: 'contact_email', label: 'Contact Email', placeholder: 'hello@devsiy.com' },
  { key: 'footer_tagline', label: 'Footer Tagline', placeholder: 'Premium website design...' },
  { key: 'appointment_url', label: 'Appointment URL', placeholder: 'https://calendar.google.com/...' },
];

const IMAGE_FIELDS = [
  { key: 'hero_image_url', label: 'Hero Background Image', ratio: '16:9' },
  { key: 'banner_image_url', label: 'About Us Banner Image', ratio: '4:3' },
];

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    adminFetch('/api/site-settings')
      .then((data) => { setSettings(data && typeof data === 'object' ? data : {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await adminFetch('/api/site-settings', { method: 'PUT', body: JSON.stringify({ key, value: settings[key] || '' }) });
    } catch (err: any) { alert(err.message); }
    finally { setSaving(null); }
  };

  const handleImage = async (key: string, file: File | null) => {
    if (!file) return;
    setUploading(key);
    try {
      const url = await uploadFile(file);
      setSettings({ ...settings, [key]: url });
      await adminFetch('/api/site-settings', { method: 'PUT', body: JSON.stringify({ key, value: url }) });
    } catch (err: any) { alert(err.message); }
    finally { setUploading(null); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-8">Site Settings</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {TEXT_FIELDS.map((field) => (
          <div key={field.key} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <label className="block text-xs text-neutral-500 mb-2 tracking-wide">{field.label}</label>
            {field.multiline ? (
              <textarea
                value={settings[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30 mb-3"
              />
            ) : (
              <input
                value={settings[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30 mb-3"
              />
            )}
            <button
              onClick={() => handleSave(field.key)}
              disabled={saving === field.key}
              className="px-4 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {saving === field.key ? 'Saving...' : 'Save'}
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-light text-white mb-4">Images</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {IMAGE_FIELDS.map((field) => (
          <div key={field.key} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <label className="block text-xs text-neutral-500 mb-2 tracking-wide">{field.label} <span className="text-neutral-600">({field.ratio})</span></label>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(field.key, e.target.files?.[0] || null)}
                disabled={uploading === field.key}
                className="text-sm text-neutral-400"
              />
              {uploading === field.key && <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
            </div>
            {settings[field.key] ? (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img src={settings[field.key]} alt={field.label} className="w-full h-40 object-cover" />
              </div>
            ) : (
              <div className="h-40 rounded-xl border border-white/10 border-dashed flex items-center justify-center text-neutral-600 text-sm">
                No image uploaded
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
