import supabase from '../db-client.js';
import { verifyAdmin, setCors } from '../admin-utils.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const settings = {};
      (data || []).forEach((s) => { settings[s.key] = s.value; });
      return res.status(200).json(settings);
    }
    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { key, value } = req.body;
      const { data: existing } = await supabase.from('site_settings').select('id').eq('key', key).single();
      let result;
      if (existing) {
        result = await supabase.from('site_settings').update({ value }).eq('id', existing.id).select().single();
      } else {
        result = await supabase.from('site_settings').insert({ key, value }).select().single();
      }
      if (result.error) throw result.error;
      return res.status(200).json(result.data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Site settings API error:', err);
    res.status(500).json({ error: err.message });
  }
}
