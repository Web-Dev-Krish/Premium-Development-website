import supabase from '../db-client.js';
import { verifyAdmin, setCors } from '../admin-utils.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { all } = req.query;
      let query = supabase.from('hosting_plans').select('*').order('display_order', { ascending: true });
      if (all === 'true') {
        const user = await verifyAdmin(req, res);
        if (!user) return;
      } else {
        query = query.eq('is_active', true);
      }
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { name, price, duration, features, is_popular, display_order, is_active } = req.body;
      const { data, error } = await supabase.from('hosting_plans').insert({ name, price, duration, features, is_popular, display_order, is_active }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id, name, price, duration, features, is_popular, display_order, is_active } = req.body;
      const { data, error } = await supabase.from('hosting_plans').update({ name, price, duration, features, is_popular, display_order, is_active }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id } = req.body;
      const { error } = await supabase.from('hosting_plans').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Hosting plans API error:', err);
    res.status(500).json({ error: err.message });
  }
}
