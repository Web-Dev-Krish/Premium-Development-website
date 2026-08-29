import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  settings: Record<string, string>;
  variant?: 'home' | 'portfolio' | 'contact';
}

export default function Navbar({ settings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Navbar is "expanded" when at top of page, or when hovered/touched while scrolled
  const isExpanded = !scrolled || hovered || mobileOpen;

  const links = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT US', href: '/#about' },
    { label: 'SERVICES', href: '/#services' },
    { label: 'WORKS', href: '/portfolio' },
    { label: 'CONTACT', href: '/contact' },
  ];

  // Scroll detection
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (Math.abs(y - lastScrollY.current) > 5) {
            setScrolled(y > 80);
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

  // Proximity detection — expand when mouse/finger is near the top of the viewport
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!scrolled) return;
      // Expand when mouse is within 80px of the top
      if (e.clientY <= 80) {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHovered(true);
      } else {
        // Delay collapse so it feels smooth
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = setTimeout(() => setHovered(false), 400);
      }
    };

    // Touch: expand on tap near top
    const handleTouchStart = (e: TouchEvent) => {
      if (!scrolled) return;
      const touch = e.touches[0];
      if (touch && touch.clientY <= 80) {
        setHovered(true);
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = setTimeout(() => setHovered(false), 3000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, [scrolled]);

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

  // Click outside to close
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 md:pt-5">
        <motion.div
          ref={navRef}
          layout
          transition={{
            layout: { type: 'spring', stiffness: 180, damping: 28, mass: 1.2 },
          }}
          className={`flex items-center justify-center rounded-full border overflow-hidden ${
            isExpanded
              ? 'bg-neutral-950/85 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/40 px-6 md:px-10 h-[54px] md:h-[58px] gap-6 md:gap-10'
              : 'bg-neutral-950/90 backdrop-blur-xl border-white/[0.08] shadow-xl shadow-black/30 px-2 h-[44px] cursor-pointer'
          }`}
          onMouseEnter={() => { if (scrolled) setHovered(true); }}
          onMouseLeave={() => {
            if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
            hoverTimeout.current = setTimeout(() => setHovered(false), 300);
          }}
          onClick={() => { if (!isExpanded) setHovered(true); }}
        >
          {/* Logo — always visible */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <motion.img
              layout
              src="/favicon.svg"
              alt="Devsiy"
              className={`rounded-lg transition-all duration-300 ${
                isExpanded ? 'w-8 h-8 md:w-9 md:h-9' : 'w-8 h-8'
              }`}
            />
          </Link>

          {/* Desktop links — only when expanded */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="hidden md:flex items-center gap-8 overflow-hidden whitespace-nowrap"
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile toggle — only when expanded */}
          <AnimatePresence>
            {isExpanded && (
              <motion.button
                ref={buttonRef}
                type="button"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.35 }}
                className="md:hidden relative z-[60] flex items-center justify-center w-10 h-10 text-white hover:bg-white/10 rounded-full transition-colors"
                onClick={toggleMenu}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
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
