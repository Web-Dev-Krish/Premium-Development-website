import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Star, Mail } from 'lucide-react';
import { adminFetch, formatDate } from '../../lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState({ leads: 0, projects: 0, featured: 0, messages: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [leads, projects, featured] = await Promise.all([
        adminFetch('/api/leads'),
        adminFetch('/api/projects'),
        adminFetch('/api/featured-websites'),
      ]);
      const safeLeads = Array.isArray(leads) ? leads : [];
      const safeProjects = Array.isArray(projects) ? projects : [];
      const safeFeatured = Array.isArray(featured) ? featured : [];
      setStats({ leads: safeLeads.length, projects: safeProjects.length, featured: safeFeatured.length, messages: 0 });
      setRecentLeads(safeLeads.slice(0, 5));
    } catch (err) {
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-light text-white mb-8">Dashboard</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Users} label="Total Leads" value={stats.leads} />
        <StatCard icon={Briefcase} label="Projects" value={stats.projects} />
        <StatCard icon={Star} label="Featured Sites" value={stats.featured} />
        <StatCard icon={Mail} label="New Today" value={recentLeads.filter((l) => new Date(l.created_at).toDateString() === new Date().toDateString()).length} />
      </div>

      <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-6">
        <h3 className="text-lg text-white font-light mb-4">Recent High-Priority Leads</h3>
        {recentLeads.length === 0 ? (
          <p className="text-neutral-500 text-sm">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-neutral-500 border-b border-white/10">
                <tr>
                  <th className="pb-3 font-normal">Date</th>
                  <th className="pb-3 font-normal">Name</th>
                  <th className="pb-3 font-normal">Project</th>
                  <th className="pb-3 font-normal">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 text-neutral-400">{formatDate(lead.created_at)}</td>
                    <td className="py-3 text-white">{lead.name}</td>
                    <td className="py-3 text-neutral-400">{lead.project_name}</td>
                    <td className="py-3"><UrgencyBadge urgency={lead.urgency} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
    >
      <Icon className="w-5 h-5 text-neutral-400 mb-4" />
      <p className="text-3xl font-light text-white mb-1">{value}</p>
      <p className="text-neutral-500 text-xs tracking-wide">{label}</p>
    </motion.div>
  );
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const colors: Record<string, string> = { High: 'text-red-400 bg-red-500/10', Medium: 'text-amber-400 bg-amber-500/10', Low: 'text-emerald-400 bg-emerald-500/10' };
  return (
    <span className={`px-2 py-1 rounded-md text-xs ${colors[urgency] || colors.Medium}`}>
      {urgency}
    </span>
  );
}
