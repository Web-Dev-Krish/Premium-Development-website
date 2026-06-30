import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer({ settings }: { settings: Record<string, string> }) {
  const year = new Date().getFullYear();
  return (
    <footer className="py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-light tracking-[0.2em] text-white mb-4">DEVSIY</h3>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              {settings?.footer_tagline || 'Premium website design and development agency. Quality over quantity, always.'}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 tracking-widest mb-4">CONTACT</p>
            <p className="text-neutral-300 text-sm mb-2">{settings?.mobile_number || '+91-9876543210'}</p>
            <p className="text-neutral-300 text-sm">{settings?.contact_email || 'hello@devsiy.com'}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 tracking-widest mb-4">FOLLOW</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href={`mailto:${settings?.contact_email || 'hello@devsiy.com'}`} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-colors"><Mail className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-600 text-xs">© {year} Devsiy. All rights reserved.</p>
          <a href="/admin/login" className="text-neutral-600 text-xs hover:text-neutral-400 transition-colors">Admin Login</a>
        </div>
      </div>
    </footer>
  );
}
