import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { adminFetch } from '../../lib/utils';

export default function HostingManager() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', price: '', duration: '', features: '', is_popular: false, display_order: 0, is_active: true });

  const fetchData = async () => {
    try {
      const data = await adminFetch('/api/hosting-plans?all=true');
      setPlans(Array.isArray(data) ? data : []);
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const reset = () => {
    setForm({ name: '', price: '', duration: '', features: '', is_popular: false, display_order: 0, is_active: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name, price: item.price, duration: item.duration, features: (item.features || []).join('\n'), is_popular: item.is_popular, display_order: item.display_order, is_active: item.is_active });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...form, features: form.features.split('\n').map(f => f.trim()).filter(Boolean) };
    if (editing) {
      await adminFetch('/api/hosting-plans', { method: 'PUT', body: JSON.stringify({ id: editing.id, ...body }) });
    } else {
      await adminFetch('/api/hosting-plans', { method: 'POST', body: JSON.stringify(body) });
    }
    reset();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete hosting plan?')) return;
    await adminFetch('/api/hosting-plans', { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light text-white">Hosting Plans</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
          <Plus className="w-4 h-4" /> Add Plan
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
            <h3 className="text-white font-light">{editing ? 'Edit Plan' : 'New Plan'}</h3>
            <button type="button" onClick={reset} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <input required placeholder="Price (e.g. ₹999 or $12)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <input required placeholder="Duration (e.g. month, year)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <input type="number" placeholder="Display Order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
          </div>
          <textarea placeholder="Features (one per line)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} rows={4} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30 mb-4" />
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} className="rounded border-white/20" />
              Popular
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-white/20" />
              Active
            </label>
          </div>
          <button type="submit" className="px-6 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">{editing ? 'Update' : 'Create'}</button>
        </motion.form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-white font-light">{plan.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${plan.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-700 text-neutral-400'}`}>{plan.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <p className="text-2xl text-white font-light mb-4">{plan.price}<span className="text-sm text-neutral-500">/{plan.duration}</span></p>
              {plan.is_popular && <span className="inline-block px-2 py-1 bg-white/10 text-white text-xs rounded mb-3">Popular</span>}
              <ul className="text-sm text-neutral-400 space-y-1 mb-4">
                {(plan.features || []).map((f: string, i: number) => <li key={i}>• {f}</li>)}
              </ul>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(plan)} className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(plan.id)} className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-red-400 hover:bg-white/5"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
