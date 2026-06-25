import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Calendar } from 'lucide-react';
import SuccessModal from './SuccessModal';

export default function LeadForm({ settings }: { settings: Record<string, string> }) {
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', project_name: '', description: '',
    budget_amount: '', currency: 'USD', urgency: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          budget_amount: parseFloat(form.budget_amount) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
      setForm({ name: '', email: '', mobile: '', project_name: '', description: '', budget_amount: '', currency: 'USD', urgency: 'Medium' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const mobileNumber = settings?.mobile_number || '+91-9876543210';
  const appointmentUrl = settings?.appointment_url || 'https://calendar.google.com';

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs tracking-[0.2em] text-neutral-500 mb-4">GET IN TOUCH</p>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Start your <span className="italic font-serif">project.</span></h2>
          <p className="text-neutral-400">Tell us what you need. We'll respond within 24 hours.</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="p-8 md:p-10 rounded-2xl border border-white/10 bg-white/[0.02]"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs text-neutral-500 mb-2 tracking-wide">YOUR NAME</label>
              <input required name="name" value={form.name} onChange={handleChange} className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-2 tracking-wide">EMAIL</label>
              <input required type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" placeholder="john@company.com" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-2 tracking-wide">MOBILE NUMBER</label>
              <input required name="mobile" value={form.mobile} onChange={handleChange} className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-2 tracking-wide">PROJECT NAME</label>
              <input required name="project_name" value={form.project_name} onChange={handleChange} className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" placeholder="E-commerce Store" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs text-neutral-500 mb-2 tracking-wide">PROJECT DESCRIPTION</label>
            <textarea required name="description" value={form.description} onChange={handleChange} rows={4} className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" placeholder="Tell us about your goals, features, and timeline..." />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs text-neutral-500 mb-2 tracking-wide">BUDGET</label>
              <div className="flex">
                <select name="currency" value={form.currency} onChange={handleChange} className="bg-neutral-900 border border-white/10 border-r-0 rounded-l-xl px-3 py-3 text-white text-sm focus:outline-none">
                  <option value="USD">$</option>
                  <option value="INR">₹</option>
                </select>
                <input required type="number" name="budget_amount" value={form.budget_amount} onChange={handleChange} className="flex-1 bg-neutral-900 border border-white/10 rounded-r-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30" placeholder="5000" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-2 tracking-wide">URGENCY</label>
              <select name="urgency" value={form.urgency} onChange={handleChange} className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/30">
                <option value="High">High — Less than 2 weeks</option>
                <option value="Medium">Medium — 2 to 6 weeks</option>
                <option value="Low">Low — More than 6 weeks</option>
              </select>
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-white text-neutral-950 rounded-xl py-4 text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : <><Send className="w-4 h-4" /> Submit Project Details</>}
          </button>
        </motion.form>
      </div>

      {submitted && (
        <SuccessModal
          mobileNumber={mobileNumber}
          appointmentUrl={appointmentUrl}
          onClose={() => setSubmitted(false)}
        />
      )}
    </section>
  );
}
