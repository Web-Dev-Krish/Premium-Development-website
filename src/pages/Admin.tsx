import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Briefcase, Star, Palette, Server,
  Users, HelpCircle, LogOut, Inbox, Settings
} from 'lucide-react';
import Dashboard from '../components/admin/Dashboard';
import LeadsManager from '../components/admin/LeadsManager';
import ProjectsManager from '../components/admin/ProjectsManager';
import FeaturedWebsitesManager from '../components/admin/FeaturedWebsitesManager';
import SkinsManager from '../components/admin/SkinsManager';
import HostingManager from '../components/admin/HostingManager';
import FoundersManager from '../components/admin/FoundersManager';
import FAQManager from '../components/admin/FAQManager';
import SiteSettingsManager from '../components/admin/SiteSettingsManager';

export default function Admin() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/leads', icon: Inbox, label: 'Leads' },
    { to: '/admin/projects', icon: Briefcase, label: 'Projects' },
    { to: '/admin/featured', icon: Star, label: 'Featured' },
    { to: '/admin/skins', icon: Palette, label: 'Skins' },
    { to: '/admin/hosting', icon: Server, label: 'Hosting' },
    { to: '/admin/founders', icon: Users, label: 'Founders' },
    { to: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900/30">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-light tracking-widest text-white">DEVSIY</h1>
          <p className="text-xs text-neutral-500 mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-neutral-400 hover:text-red-400 hover:bg-white/5 transition-colors mt-4"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsManager />} />
          <Route path="/projects" element={<ProjectsManager />} />
          <Route path="/featured" element={<FeaturedWebsitesManager />} />
          <Route path="/skins" element={<SkinsManager />} />
          <Route path="/hosting" element={<HostingManager />} />
          <Route path="/founders" element={<FoundersManager />} />
          <Route path="/faqs" element={<FAQManager />} />
          <Route path="/settings" element={<SiteSettingsManager />} />
        </Routes>
      </main>
    </div>
  );
}
