import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Video, Instagram, Facebook, Youtube, Eye, EyeOff, Upload } from 'lucide-react';
import SafeImage from '../SafeImage';
import { adminFetch, uploadFile } from '../../lib/utils';

export default function RecentWorkManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const initialForm = {
    title: '',
    description: '',
    media_type: 'image',
    media_url: '',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    show_instagram: true,
    show_facebook: true,
    show_youtube: true,
    show_social_buttons: true,
    display_order: 0,
    is_active: true,
  };

  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      const data = await adminFetch('/api/recent-work?all=true');
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reset = () => {
    setForm(initialForm);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      media_type: item.media_type || 'image',
      media_url: item.media_url || '',
      instagram_url: item.instagram_url || '',
      facebook_url: item.facebook_url || '',
      youtube_url: item.youtube_url || '',
      show_instagram: item.show_instagram ?? true,
      show_facebook: item.show_facebook ?? true,
      show_youtube: item.show_youtube ?? true,
      show_social_buttons: item.show_social_buttons ?? true,
      display_order: item.display_order || 0,
      is_active: item.is_active ?? true,
    });
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      // Auto detect media_type based on file extension
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/i.test(file.name);
      setForm((prev) => ({
        ...prev,
        media_url: url,
        media_type: isVideo ? 'video' : prev.media_type,
      }));
    } catch (err: any) {
      alert(`File upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.media_url) {
      alert('Please fill in Title and Media URL/File');
      return;
    }
    try {
      if (editing) {
        await adminFetch('/api/recent-work', { method: 'PUT', body: JSON.stringify({ id: editing.id, ...form }) });
      } else {
        await adminFetch('/api/recent-work', { method: 'POST', body: JSON.stringify(form) });
      }
      reset();
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete recent work item?')) return;
    try {
      await adminFetch('/api/recent-work', { method: 'DELETE', body: JSON.stringify({ id }) });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-white">Recent Work Showcase</h2>
          <p className="text-sm text-neutral-400 mt-1">Manage recent work images, videos, and social link attachments</p>
        </div>
        <button
          onClick={() => { reset(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-950 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Recent Work
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg text-white font-light">{editing ? 'Edit Recent Work' : 'New Recent Work'}</h3>
            <button type="button" onClick={reset} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">WORK TITLE *</label>
              <input
                required
                placeholder="e.g. Luxury Brand Redesign"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">MEDIA TYPE</label>
              <select
                value={form.media_type}
                onChange={(e) => setForm({ ...form, media_type: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30"
              >
                <option value="image">Image (Photo / Banner)</option>
                <option value="video">Video (MP4 / WebM / Embedded)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">MEDIA FILE OR DIRECT URL *</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                required
                placeholder="https://example.com/media.mp4 or upload below"
                value={form.media_url}
                onChange={(e) => setForm({ ...form, media_url: e.target.value })}
                className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30"
              />
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 border border-white/10 rounded-lg text-sm text-neutral-200 hover:bg-neutral-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Upload File'}
                <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" disabled={uploading} />
              </label>
            </div>

            {/* Media Preview Box */}
            {form.media_url && (
              <div className="mt-3 p-3 bg-neutral-900/80 border border-white/10 rounded-xl max-w-sm">
                <p className="text-[11px] text-neutral-500 mb-2">Media Preview:</p>
                {form.media_type === 'video' ? (
                  <video src={form.media_url} controls className="w-full aspect-video rounded-lg bg-black object-cover" />
                ) : (
                  <SafeImage src={form.media_url} alt="Preview" className="w-full aspect-video rounded-lg object-cover" />
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">DESCRIPTION</label>
            <textarea
              placeholder="Brief description of the work..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">DISPLAY ORDER</label>
              <input
                type="number"
                placeholder="0"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded border-white/20 text-white focus:ring-0"
                />
                Item Active / Published
              </label>
            </div>
          </div>

          {/* Social Media Settings Box */}
          <div className="border border-white/10 bg-neutral-950/60 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-white text-sm font-medium">Social Media Buttons (At Bottom of Card)</h4>
                <p className="text-xs text-neutral-400">Configure links and enable/disable buttons individually or all together</p>
              </div>
              <label className="flex items-center gap-2 text-xs text-emerald-400 cursor-pointer bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <input
                  type="checkbox"
                  checked={form.show_social_buttons}
                  onChange={(e) => setForm({ ...form, show_social_buttons: e.target.checked })}
                  className="rounded border-emerald-500/30"
                />
                Master Social Toggle ({form.show_social_buttons ? 'Enabled' : 'Disabled'})
              </label>
            </div>

            {form.show_social_buttons && (
              <div className="space-y-3 pt-2">
                {/* Instagram */}
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-400 flex-shrink-0" />
                  <input
                    placeholder="Instagram URL (e.g. https://instagram.com/devsiy)"
                    value={form.instagram_url}
                    onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white/30"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.show_instagram}
                      onChange={(e) => setForm({ ...form, show_instagram: e.target.checked })}
                      className="rounded border-white/20"
                    />
                    Enable
                  </label>
                </div>

                {/* Facebook */}
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <input
                    placeholder="Facebook URL (e.g. https://facebook.com/devsiy)"
                    value={form.facebook_url}
                    onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white/30"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.show_facebook}
                      onChange={(e) => setForm({ ...form, show_facebook: e.target.checked })}
                      className="rounded border-white/20"
                    />
                    Enable
                  </label>
                </div>

                {/* YouTube */}
                <div className="flex items-center gap-3">
                  <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <input
                    placeholder="YouTube URL (e.g. https://youtube.com/@devsiy)"
                    value={form.youtube_url}
                    onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                    className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white/30"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.show_youtube}
                      onChange={(e) => setForm({ ...form, show_youtube: e.target.checked })}
                      className="rounded border-white/20"
                    />
                    Enable
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={reset}
              className="px-5 py-2 rounded-lg text-sm border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-white text-neutral-950 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              {editing ? 'Update Work' : 'Create Recent Work'}
            </button>
          </div>
        </motion.form>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-video bg-neutral-900">
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-neutral-950/80 backdrop-blur-md border border-white/10 text-white text-xs rounded-full">
                  {item.media_type === 'video' ? <Video className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-emerald-400" />}
                  <span className="capitalize">{item.media_type}</span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400 border border-white/10'}`}>
                    {item.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>

                {item.media_type === 'video' ? (
                  <video src={item.media_url} className="w-full h-full object-cover" muted loop onMouseOver={(e) => (e.target as HTMLVideoElement).play()} onMouseOut={(e) => (e.target as HTMLVideoElement).pause()} />
                ) : (
                  <SafeImage src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg text-white font-light mb-1">{item.title}</h3>
                  <p className="text-neutral-400 text-xs line-clamp-2 mb-4">{item.description}</p>
                </div>

                {/* Social Badges Preview */}
                <div className="border-t border-white/10 pt-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span>Social Buttons:</span>
                    <span className="flex items-center gap-1">
                      {item.show_social_buttons ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-neutral-500" />}
                      {item.show_social_buttons ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>

                  {item.show_social_buttons && (
                    <div className="flex items-center gap-2">
                      {item.show_instagram && <span title={item.instagram_url || 'No URL set'}><Instagram className={`w-4 h-4 ${item.instagram_url ? 'text-pink-400' : 'text-neutral-600'}`} /></span>}
                      {item.show_facebook && <span title={item.facebook_url || 'No URL set'}><Facebook className={`w-4 h-4 ${item.facebook_url ? 'text-blue-400' : 'text-neutral-600'}`} /></span>}
                      {item.show_youtube && <span title={item.youtube_url || 'No URL set'}><Youtube className={`w-4 h-4 ${item.youtube_url ? 'text-red-500' : 'text-neutral-600'}`} /></span>}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg border border-white/10 text-xs text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
