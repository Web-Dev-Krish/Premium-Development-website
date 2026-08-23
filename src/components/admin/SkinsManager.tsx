import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { adminFetch } from '../../lib/utils';

export default function SkinsManager() {
  const [skins, setSkins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkins = async () => {
    try {
      const data = await adminFetch('/api/website-skins');
      setSkins(Array.isArray(data) ? data : []);
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSkins(); }, []);

  const toggleSkin = async (skin: any) => {
    await adminFetch('/api/website-skins', {
      method: 'PUT',
      body: JSON.stringify({ id: skin.id, is_active: !skin.is_active, special_offer_text: skin.special_offer_text, badge_color: skin.badge_color }),
    });
    fetchSkins();
  };

  const updateSkin = async (skin: any, updates: any) => {
    await adminFetch('/api/website-skins', {
      method: 'PUT',
      body: JSON.stringify({ id: skin.id, is_active: skin.is_active, special_offer_text: skin.special_offer_text, badge_color: skin.badge_color, ...updates }),
    });
    fetchSkins();
  };

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-8">Website Skins</h2>
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skins.map((skin) => (
            <motion.div
              key={skin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border ${skin.is_active ? 'border-white bg-white/[0.05]' : 'border-white/10 bg-white/[0.02]'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg text-white font-light capitalize">{skin.name}</h3>
                <button
                  onClick={() => toggleSkin(skin)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${skin.is_active ? 'bg-white' : 'bg-neutral-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full transition-all ${skin.is_active ? 'left-5 bg-neutral-950' : 'left-1 bg-neutral-400'}`} />
                </button>
              </div>
              <p className="text-neutral-500 text-xs mb-4 uppercase tracking-wider">{skin.key}</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Offer Text</label>
                  <input
                    value={skin.special_offer_text}
                    onChange={(e) => setSkins(skins.map((s) => s.id === skin.id ? { ...s, special_offer_text: e.target.value } : s))}
                    onBlur={() => updateSkin(skin, { special_offer_text: skin.special_offer_text })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">Badge Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={skin.badge_color || '#ef4444'}
                      onChange={(e) => setSkins(skins.map((s) => s.id === skin.id ? { ...s, badge_color: e.target.value } : s))}
                      onBlur={() => updateSkin(skin, { badge_color: skin.badge_color })}
                      className="w-10 h-10 rounded-lg bg-transparent border border-white/10"
                    />
                    <span className="text-xs text-neutral-400">{skin.badge_color}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                {skin.is_active ? <><Check className="w-4 h-4 text-emerald-400" /> <span className="text-emerald-400">Active on site</span></> : <><X className="w-4 h-4 text-neutral-500" /> <span className="text-neutral-500">Inactive</span></>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
