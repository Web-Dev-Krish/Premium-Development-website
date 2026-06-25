import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { adminFetch, uploadFile } from '../../lib/utils';

export default function FoundersManager() {
  const [founders, setFounders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ role: 'founder', name: '', title: '', bio: '', image_url: '', display_order: 0 });

  const fetchData = async () => {
    try {
      const data = await adminFetch('/api/founders');
      setFounders(Array.isArray(data) ? data : []);
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const reset = () => {
    setForm({ role: 'founder', name: '', title: '', bio: '', image_url: '', display_order: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ role: item.role, name: item.name, title: item.title, bio: item.bio, image_url: item.image_url || '', display_order: item.display_order });
    setShowForm(true);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFile(file);
      setForm({ ...form, image_url: url });
    } catch (err: any) { alert(err.message); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await adminFetch('/api/founders', { method: 'PUT', body: JSON.stringify({ id: editing.id, ...form }) });
    } else {
      await adminFetch('/api/founders', { method: 'POST', body: JSON.stringify(form) });
    }
    reset();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete founder?')) return;
    await adminFetch('/api/founders', { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light text-white">Founders</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
          <Plus className="w-4 h-4" /> Add Founder
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
          onSubmit={handleSubmit}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-light">{editing ? 'Edit Founder' : 'New Founder'}</h3>
            <button type="button" onClick={reset} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30">
              <option value="founder">Founder</option>
              <option value="co-founder">Co-Founder</option>
            </select>
            <input type="number" placeholder="Display Order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <div className="flex items-center gap-3 md:col-span-2">
              <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-neutral-400" />
              {form.image_url && <img src={form.image_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-white/10" />}
            </div>
          </div>
          <textarea placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30 mb-4" />
          <button type="submit" className="px-6 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">{editing ? 'Update' : 'Create'}</button>
        </motion.form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {founders.map((founder) => (
            <div key={founder.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 shrink-0">
                {founder.image_url ? <img src={founder.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500">{founder.name?.charAt(0)}</div>}
              </div>
              <div className="flex-1">
                <p className="text-xs text-neutral-500 uppercase tracking-wider">{founder.role}</p>
                <h3 className="text-white font-light">{founder.name}</h3>
                <p className="text-sm text-neutral-400 mb-2">{founder.title}</p>
                <p className="text-neutral-500 text-sm line-clamp-2 mb-3">{founder.bio}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(founder)} className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(founder.id)} className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-red-400 hover:bg-white/5"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
