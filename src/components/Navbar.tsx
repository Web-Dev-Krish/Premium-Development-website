import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar({ settings }: { settings: Record<string, string> }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#portfolio' },
    { label: 'Hosting', href: '#hosting' },
    { label: 'Team', href: '#founders' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  // Scroll state with throttling via requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (Math.abs(y - lastScrollY.current) > 5) {
            setScrolled(y > 50);
            lastScrollY.current = y;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  // Click outside to close — explicitly exclude the toggle button
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent | MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedButton = buttonRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);
      if (!clickedButton && !clickedMenu) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener('pointerdown', handlePointerDown);
    }
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [mobileOpen]);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [mobileOpen]);

  const toggleMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen ? 'bg-neutral-950/95 backdrop-blur-md border-b border-white/10' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <a href="#" className="text-2xl font-light tracking-[0.2em] text-white">
            DEVSIY
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-300 hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${settings?.mobile_number || '+91-98765-43210'}`}
              className="text-sm px-5 py-2 border border-white/20 rounded-full text-white hover:bg-white hover:text-neutral-950 transition-all"
            >
              {settings?.mobile_number || '+91-98765-43210'}
            </a>
          </div>

          {/* Mobile toggle — placed above overlay via z-index */}
          <button
            ref={buttonRef}
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden relative z-[60] flex items-center justify-center w-11 h-11 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={toggleMenu}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay — sibling to nav so it sits above page content but below the toggle button */}
      {mobileOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-[55] md:hidden bg-neutral-950/98 backdrop-blur-lg"
          aria-modal="true"
          role="dialog"
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6 pt-[72px]">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-3xl font-light text-white hover:text-neutral-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`tel:${settings?.mobile_number || '+91-98765-43210'}`}
              onClick={handleLinkClick}
              className="mt-6 px-8 py-3 bg-white text-neutral-950 rounded-full text-sm font-medium"
            >
              {settings?.mobile_number || '+91-98765-43210'}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
