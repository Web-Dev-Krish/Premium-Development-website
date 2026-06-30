import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { adminFetch } from '../../lib/utils';

export default function FAQManager() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', display_order: 0, is_active: true });

  const fetchData = async () => {
    try {
      const data = await adminFetch('/api/faqs?all=true');
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const reset = () => {
    setForm({ question: '', answer: '', display_order: 0, is_active: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setForm({ question: item.question, answer: item.answer, display_order: item.display_order, is_active: item.is_active });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await adminFetch('/api/faqs', { method: 'PUT', body: JSON.stringify({ id: editing.id, ...form }) });
    } else {
      await adminFetch('/api/faqs', { method: 'POST', body: JSON.stringify(form) });
    }
    reset();
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete FAQ?')) return;
    await adminFetch('/api/faqs', { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-light text-white">FAQs</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
          <Plus className="w-4 h-4" /> Add FAQ
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
            <h3 className="text-white font-light">{editing ? 'Edit FAQ' : 'New FAQ'}</h3>
            <button type="button" onClick={reset} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input required placeholder="Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
            <input type="number" placeholder="Display Order" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30" />
          </div>
          <textarea required placeholder="Answer" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} className="w-full bg-neutral-900 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-white/30 mb-4" />
          <label className="flex items-center gap-2 text-sm text-neutral-300 mb-4">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-white/20" />
            Active
          </label>
          <button type="submit" className="px-6 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">{editing ? 'Update' : 'Create'}</button>
        </motion.form>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-white font-light mb-1">{faq.question}</p>
                  <p className="text-neutral-400 text-sm">{faq.answer}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded h-fit ${faq.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-700 text-neutral-400'}`}>{faq.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(faq)} className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(faq.id)} className="p-2 rounded-lg border border-white/10 text-neutral-400 hover:text-red-400 hover:bg-white/5"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
