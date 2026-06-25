import supabase from './db-client.js';
import { verifyAdmin, setCors } from './admin-utils.js';

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const user = await verifyAdmin(req, res);
      if (!user) return;
      const { fileName, fileBase64, contentType } = req.body;
      if (!fileName || !fileBase64 || !contentType) {
        return res.status(400).json({ error: 'Missing file data' });
      }
      const buffer = Buffer.from(fileBase64, 'base64');
      const path = `${Date.now()}-${fileName}`;
      const { data, error } = await supabase.storage.from('devsiy-uploads').upload(path, buffer, { contentType, upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('devsiy-uploads').getPublicUrl(path);
      return res.status(200).json({ url: urlData.publicUrl, path });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
}
