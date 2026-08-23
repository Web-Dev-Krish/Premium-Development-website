import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function SkinEffects({ skins }: { skins: any[] }) {
  const activeSkins = useMemo(() => (skins || []).filter((s) => s.is_active), [skins]);
  const activeKeys = useMemo(() => new Set(activeSkins.map((s) => s.key)), [activeSkins]);

  const snowflakes = useMemo(() => Array.from({ length: 30 }, (_, i) => i), []);
  const confetti = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);
  const lanterns = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  return (
    <>
      {activeSkins.map((skin) => (
        <div key={skin.id} className="fixed top-20 left-1/2 -translate-x-1/2 z-[60]">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-2 rounded-full text-xs font-medium shadow-lg"
            style={{ backgroundColor: skin.badge_color || '#ef4444', color: '#fff' }}
          >
            {skin.special_offer_text || skin.name}
          </motion.div>
        </div>
      ))}

      {activeKeys.has('christmas') && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {snowflakes.map((i) => (
            <motion.div
              key={i}
              initial={{ y: '-10vh', opacity: 0.8 }}
              animate={{ y: '110vh' }}
              transition={{ duration: 5 + (i % 5), repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
              className="absolute w-2 h-2 rounded-full bg-white/60"
              style={{ left: `${(i * 3.3) % 100}%`, top: 0 }}
            />
          ))}
        </div>
      )}

      {activeKeys.has('newyear') && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {confetti.map((i) => (
            <motion.div
              key={i}
              initial={{ y: '100vh', opacity: 1, rotate: 0 }}
              animate={{ y: '-20vh', rotate: 360 }}
              transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: i * 0.25, ease: 'linear' }}
              className="absolute text-lg"
              style={{ left: `${(i * 5) % 100}%`, color: ['#fbbf24', '#f472b6', '#60a5fa', '#a78bfa'][i % 4] }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      {activeKeys.has('festival') && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {lanterns.map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -15, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
              className="absolute text-2xl"
              style={{ left: `${8 + i * 7}%`, top: `${10 + (i % 4) * 5}%` }}
            >
              🪔
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
