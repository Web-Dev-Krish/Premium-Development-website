import supabase from './db-client.js';
import { verifyAdmin, setCors } from './admin-utils.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('founders').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { role, name, title, bio, image_url, display_order } = req.body;
      const { data, error } = await supabase.from('founders').insert({ role, name, title, bio, image_url, display_order }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id, role, name, title, bio, image_url, display_order } = req.body;
      const { data, error } = await supabase.from('founders').update({ role, name, title, bio, image_url, display_order }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id } = req.body;
      const { error } = await supabase.from('founders').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
