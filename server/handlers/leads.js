import supabase from '../db-client.js';
import { verifyAdmin, setCors } from '../admin-utils.js';

const urgencyWeight = { High: 3, Medium: 2, Low: 1 };

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { status } = req.query;
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (status) query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      const sorted = (data || []).sort((a, b) => {
        const uw = (urgencyWeight[b.urgency] || 0) - (urgencyWeight[a.urgency] || 0);
        if (uw !== 0) return uw;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      return res.status(200).json(sorted);
    }
    if (req.method === 'POST') {
      const { name, email, mobile, project_name, description, budget_amount, currency, urgency } = req.body;
      const { data, error } = await supabase.from('leads').insert({
        name, email, mobile, project_name, description, budget_amount, currency, urgency, status: 'New'
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id, status } = req.body;
      const { data, error } = await supabase.from('leads').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id } = req.body;
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Leads API error:', err);
    res.status(500).json({ error: err.message });
  }
}
