import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Sparkles } from 'lucide-react';

// Hero background images — served from /public folder.
// To change images, simply replace the files in /public:
//   hero1.png, hero2.png, hero3.png
const heroImages = ['/hero1.png', '/hero2.png', '/hero3.png'];

const FADE_INTERVAL_MS = 5000; // Switch image every 5 seconds

export default function Hero({ settings }: { settings: Record<string, string> }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance the slideshow
  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(advance, FADE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [advance]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Fade Effect */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIndex}
            src={heroImages[currentIndex]}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </AnimatePresence>
        {/* Dark overlays for readability */}
        <div className="absolute inset-0 bg-neutral-950/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-transparent to-neutral-950" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs tracking-widest text-neutral-300 mb-8"
        >
          <Sparkles className="w-3 h-3 text-white" />
          {settings?.hero_tagline || 'WEBSITES BUILT TO GET YOU LEADS'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight mb-6"
        >
          We build websites
          <span className="block text-neutral-400">that turn visitors into </span>
          <span className="italic font-serif text-white">customers.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
        >
          {settings?.hero_subtitle || 'We design, build, and automate websites that generate real leads for your business — not just good looks.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/contact"
            className="px-8 py-4 bg-white text-neutral-950 rounded-full text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5"
          >
            Start Your Project
          </Link>
          <a
            href="#services"
            className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm text-white hover:bg-white/10 transition-colors"
          >
            Explore Services
          </a>
        </motion.div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <a href="#services" className="text-neutral-400 hover:text-white transition-colors">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
