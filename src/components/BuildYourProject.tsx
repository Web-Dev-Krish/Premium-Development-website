import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function BuildYourProject() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-16 text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_60%)]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs tracking-widest text-neutral-300 mb-6">
              <Sparkles className="w-3 h-3" /> START TODAY
            </div>
            <h2 className="text-3xl md:text-5xl font-light text-white mb-4">
              Ready to build your <span className="italic font-serif">project?</span>
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto mb-8">
              Share your vision with us and get a tailored proposal within 24 hours. No obligations, just clarity.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-950 rounded-full text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors"
            >
              Build Your Project <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
