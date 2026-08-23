import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import { adminFetch, formatDate, currencySymbol } from '../../lib/utils';

export default function LeadsManager() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const url = statusFilter === 'all' ? '/api/leads' : `/api/leads?status=${statusFilter}`;
      const data = await adminFetch(url);
      setLeads(Array.isArray(data) ? data : []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [statusFilter]);

  const updateStatus = async (id: number, status: string) => {
    await adminFetch('/api/leads', { method: 'PUT', body: JSON.stringify({ id, status }) });
    fetchLeads();
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Delete this lead?')) return;
    await adminFetch('/api/leads', { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchLeads();
  };

  const exportExcel = () => {
    const rows = leads.map((l) => ({
      Date: formatDate(l.created_at),
      Name: l.name,
      Email: l.email,
      Mobile: l.mobile,
      Project: l.project_name,
      Description: l.description,
      Budget: `${currencySymbol(l.currency)} ${l.budget_amount}`,
      Urgency: l.urgency,
      Status: l.status,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    XLSX.writeFile(wb, `devsiy-leads-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-light text-white">Leads</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02]">
            <Filter className="w-4 h-4 text-neutral-500" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-sm text-white focus:outline-none">
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <button onClick={exportExcel} className="flex items-center gap-2 px-4 py-2 bg-white text-neutral-950 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
            <Download className="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02]">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-neutral-400">
              <tr>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal">Name</th>
                <th className="p-4 font-normal">Contact</th>
                <th className="p-4 font-normal">Project</th>
                <th className="p-4 font-normal">Budget</th>
                <th className="p-4 font-normal">Urgency</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-neutral-400 whitespace-nowrap">{formatDate(lead.created_at)}</td>
                  <td className="p-4 text-white">{lead.name}<div className="text-xs text-neutral-500">{lead.email}</div></td>
                  <td className="p-4 text-neutral-300">{lead.mobile}</td>
                  <td className="p-4 text-neutral-300 max-w-xs truncate" title={lead.project_name}>{lead.project_name}</td>
                  <td className="p-4 text-neutral-300">{currencySymbol(lead.currency)} {lead.budget_amount}</td>
                  <td className="p-4"><UrgencyBadge urgency={lead.urgency} /></td>
                  <td className="p-4">
                    <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value)} className="bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none">
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => deleteLead(lead.id)} className="text-neutral-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </motion.tr>
              ))}
              {leads.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-neutral-500">No leads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const colors: Record<string, string> = { High: 'text-red-400 bg-red-500/10', Medium: 'text-amber-400 bg-amber-500/10', Low: 'text-emerald-400 bg-emerald-500/10' };
  return <span className={`px-2 py-1 rounded-md text-xs ${colors[urgency] || colors.Medium}`}>{urgency}</span>;
}
