import supabase from '../db-client.js';
import { verifyAdmin, setCors } from '../admin-utils.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { all } = req.query;
      let query = supabase.from('recent_works').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false });
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
      const {
        title,
        description,
        media_type,
        media_url,
        instagram_url,
        facebook_url,
        youtube_url,
        show_instagram,
        show_facebook,
        show_youtube,
        show_social_buttons,
        display_order,
        is_active,
      } = req.body;

      const { data, error } = await supabase
        .from('recent_works')
        .insert({
          title,
          description,
          media_type: media_type || 'image',
          media_url,
          instagram_url: instagram_url || '',
          facebook_url: facebook_url || '',
          youtube_url: youtube_url || '',
          show_instagram: show_instagram ?? true,
          show_facebook: show_facebook ?? true,
          show_youtube: show_youtube ?? true,
          show_social_buttons: show_social_buttons ?? true,
          display_order: display_order || 0,
          is_active: is_active ?? true,
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const {
        id,
        title,
        description,
        media_type,
        media_url,
        instagram_url,
        facebook_url,
        youtube_url,
        show_instagram,
        show_facebook,
        show_youtube,
        show_social_buttons,
        display_order,
        is_active,
      } = req.body;

      const { data, error } = await supabase
        .from('recent_works')
        .update({
          title,
          description,
          media_type: media_type || 'image',
          media_url,
          instagram_url: instagram_url || '',
          facebook_url: facebook_url || '',
          youtube_url: youtube_url || '',
          show_instagram: show_instagram ?? true,
          show_facebook: show_facebook ?? true,
          show_youtube: show_youtube ?? true,
          show_social_buttons: show_social_buttons ?? true,
          display_order: display_order || 0,
          is_active: is_active ?? true,
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { id } = req.body;
      const { error } = await supabase.from('recent_works').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Recent work API error:', err);
    res.status(500).json({ error: err.message });
  }
}
