import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import SafeImage from './SafeImage';

export default function Hero({ settings }: { settings: Record<string, string> }) {
  const hasImage = !!settings?.hero_image_url;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {hasImage ? (
        <>
          <div className="absolute inset-0">
            <SafeImage
              src={settings.hero_image_url}
              alt="Hero background"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-neutral-950/70" />
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.04),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.02),transparent_40%)]" />
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest text-neutral-300 mb-8"
        >
          <Sparkles className="w-3 h-3" />
          {settings?.hero_tagline || 'PREMIUM WEB DESIGN AGENCY'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight mb-6"
        >
          We craft digital
          <span className="block text-neutral-500">experiences that </span>
          <span className="italic font-serif">define luxury.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 font-light"
        >
          {settings?.hero_subtitle || 'Quality over quantity. Bespoke websites, e-commerce platforms, and digital products for brands that demand excellence.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="px-8 py-4 bg-white text-neutral-950 rounded-full text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors"
          >
            Start Your Project
          </a>
          <a
            href="#portfolio"
            className="px-8 py-4 border border-white/20 text-white rounded-full text-sm tracking-wide hover:bg-white/5 transition-colors"
          >
            View Our Work
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a href="#services" className="text-neutral-500 hover:text-white transition-colors">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
