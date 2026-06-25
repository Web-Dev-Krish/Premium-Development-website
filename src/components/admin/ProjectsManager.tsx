import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { adminFetch, uploadFile } from '../../lib/utils';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category_id: '', image_url: '', project_url: '', is_featured: false });

  const fetchData = async () => {
    try {
      const [p, c] = await Promise.all([adminFetch('/api/projects'), adminFetch('/api/categories')]);
      setProjects(Array.isArray(p) ? p : []);
      setCategories(Array.isArray(c) ? c : []);
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const reset = () => {
    setForm({ title: '', description: '', category_id: '', image_url: '', project_url: '', is_featured: false });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, category_id: item.category_id?.toString() || '', image_url: item.image_url || '', project_url: item.project_url || '', is_featured: item.is_featured });
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
    const body = { ...form, category_id: form.category_id ? parseInt(form.category_id) : null };
    if (editing) {
      await adminFetch('/api/projects', { method: 'PUT', body: JSON.stringify({ id: editing.id, ...body }) });
    } else {
      await adminFetch('/api/projects', { method: 'POST', body: JSON.stringify(body) });
    }
    reset();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete project?')) return;
    await adminFetch('/api/projects', { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light text-white">Projects</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
          <Plus className="w-4 h-4" /> Add Project
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
            <h3 className="text-white font-light">{editing ? 'Edit Project' : 'New Project'}</h3>
            <button type="button" onClick={reset} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30">
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input placeholder="Project URL" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-neutral-400" />
              {form.image_url && <img src={form.image_url} alt="" className="w-10 h-10 object-cover rounded-lg border border-white/10" />}
            </div>
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30 mb-4" />
          <label className="flex items-center gap-2 text-sm text-neutral-300 mb-4">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-white/20" />
            Featured on homepage
          </label>
          <button type="submit" className="px-6 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">{editing ? 'Update' : 'Create'}</button>
        </motion.form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="aspect-video bg-neutral-900">
                {project.image_url ? <img src={project.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-neutral-500">{project.categories?.name}</p>
                    <h3 className="text-white font-light">{project.title}</h3>
                  </div>
                  {project.is_featured && <span className="px-2 py-1 bg-white/10 text-white text-xs rounded">Featured</span>}
                </div>
                <p className="text-neutral-400 text-sm mt-2 line-clamp-2">{project.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(project)} className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-red-400 hover:bg-white/5"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
