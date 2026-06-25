import supabase from './db-client.js';
import { verifyAdmin, setCors } from './admin-utils.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('website_skins').select('*').order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id, is_active, special_offer_text, badge_color } = req.body;
      const { data, error } = await supabase.from('website_skins').update({ is_active, special_offer_text, badge_color }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
