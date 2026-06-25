import supabase from './db-client.js';
import { verifyAdmin, setCors } from './admin-utils.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { category_id, featured } = req.query;
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (category_id) query = query.eq('category_id', category_id);
      if (featured === 'true') query = query.eq('is_featured', true);
      const { data: projects, error } = await query;
      if (error) throw error;

      const { data: categories } = await supabase.from('categories').select('*');
      const catMap = {};
      (categories || []).forEach((c) => { catMap[c.id] = c; });

      const enriched = (projects || []).map((p) => ({
        ...p,
        categories: catMap[p.category_id] || null,
      }));
      return res.status(200).json(enriched);
    }
    if (req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { title, description, category_id, image_url, project_url, is_featured } = req.body;
      const { data, error } = await supabase.from('projects').insert({ title, description, category_id, image_url, project_url, is_featured }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id, title, description, category_id, image_url, project_url, is_featured } = req.body;
      const { data, error } = await supabase.from('projects').update({ title, description, category_id, image_url, project_url, is_featured }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id } = req.body;
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
