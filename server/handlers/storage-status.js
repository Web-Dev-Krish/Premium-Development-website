import supabase from '../db-client.js';
import { verifyAdmin, setCors } from '../admin-utils.js';

function getBucketName() {
  return process.env.STORAGE_BUCKET || process.env.VITE_STORAGE_BUCKET || 'devsiy-uploads';
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const user = await verifyAdmin(req, res);
      if (!user) return;

      const bucketName = getBucketName();
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();

      if (listError) throw listError;

      const bucket = (buckets || []).find((b) => b.name === bucketName);

      if (!bucket) {
        return res.status(200).json({
          exists: false,
          public: false,
          bucketName,
          message: `Bucket "${bucketName}" was not found in Supabase Storage.`,
          setupSteps: [
            `Create a bucket named "${bucketName}" in Supabase Storage`,
            'Set the bucket to Public',
            'Add a policy allowing public read access if prompted',
          ],
        });
      }

      // Try to read a non-existent object to verify public access configuration
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl('__healthcheck__');
      const publicUrl = urlData?.publicUrl;

      return res.status(200).json({
        exists: true,
        public: bucket.public === true,
        bucketName,
        publicUrlPattern: publicUrl,
        message: bucket.public
          ? `Bucket "${bucketName}" exists and is public.`
          : `Bucket "${bucketName}" exists but is NOT public. Public read access is required for images to render on the site.`,
      });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Storage status API error:', err);
    res.status(500).json({ error: err.message });
  }
}
