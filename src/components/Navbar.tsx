import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  settings: Record<string, string>;
  // Kept for backward compatibility with existing pages that still pass a
  // variant prop; the navbar now shows the same global links everywhere.
  variant?: 'home' | 'portfolio' | 'contact';
}

export default function Navbar({ settings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);

  // Global navigation — identical on every page of the site.
  const links = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT US', href: '/#about' },
    { label: 'SERVICES', href: '/#services' },
    { label: 'WORKS', href: '/portfolio' },
    { label: 'CONTACT', href: '/contact' },
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-6">
        <div
          className={`flex items-center gap-6 md:gap-10 px-6 md:px-10 h-[56px] md:h-[60px] rounded-full border transition-all duration-500 ${
            scrolled || mobileOpen
              ? 'bg-neutral-950/90 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/40'
              : 'bg-neutral-900/70 backdrop-blur-md border-white/[0.06] shadow-xl shadow-black/20'
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/favicon.svg"
              alt="Devsiy"
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) =>
              link.href.startsWith('/') && !link.href.includes('#') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-[13px] text-neutral-300 hover:text-white transition-colors tracking-[0.15em] font-medium"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-neutral-300 hover:text-white transition-colors tracking-[0.15em] font-medium"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Mobile toggle */}
          <button
            ref={buttonRef}
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden relative z-[60] flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-full transition-colors"
            onClick={toggleMenu}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-[55] md:hidden bg-neutral-950/98 backdrop-blur-lg"
          aria-modal="true"
          role="dialog"
        >
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6 pt-[72px]">
            {links.map((link) =>
              link.href.startsWith('/') && !link.href.includes('#') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={handleLinkClick}
                  className="text-2xl font-light text-white hover:text-neutral-300 transition-colors tracking-[0.15em]"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="text-2xl font-light text-white hover:text-neutral-300 transition-colors tracking-[0.15em]"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href={`tel:${settings?.mobile_number || '+91-98765-43210'}`}
              onClick={handleLinkClick}
              className="mt-6 px-8 py-3 bg-white text-neutral-950 rounded-full text-sm font-medium tracking-wide"
            >
              {settings?.mobile_number || '+91-98765-43210'}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
