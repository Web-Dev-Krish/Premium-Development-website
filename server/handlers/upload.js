import supabase from '../db-client.js';
import { verifyAdmin, setCors } from '../admin-utils.js';

function getBucketName() {
  return process.env.STORAGE_BUCKET || process.env.VITE_STORAGE_BUCKET || 'devsiy-uploads';
}

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

      const bucketName = getBucketName();
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucket = (buckets || []).find((b) => b.name === bucketName);
      if (!bucket) {
        return res.status(404).json({
          error: `Unable to find bucket "${bucketName}". Please create it in Supabase Storage and make it public.`,
          bucketName,
        });
      }

      const buffer = Buffer.from(fileBase64, 'base64');
      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ error: 'Uploaded file is empty or base64 is invalid' });
      }

      // Sanitize filename: strip path separators, spaces, and non-ASCII characters
      const safeName = fileName
        .replace(/\\/g, '/')
        .split('/')
        .pop()
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .replace(/-+/g, '-');
      const path = `${Date.now()}-${safeName}`;

      const { data, error } = await supabase.storage.from(bucketName).upload(path, buffer, { contentType, upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(path);
      return res.status(200).json({ url: urlData.publicUrl, path });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Upload API error:', err);
    res.status(500).json({ error: err.message });
  }
}
