'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDiaryStore } from '@/lib/store';
import { MOOD_CATEGORIES } from '@/lib/constants';
import { MoodIconComponents } from './icons/MoodIcons';

export default function BackgroundAura() {
  const selectedMood = useDiaryStore((state) => state.selectedMood);

  const moodColor = selectedMood ? MOOD_CATEGORIES[selectedMood].color : 'default';
  const IconComponent = selectedMood ? MoodIconComponents[selectedMood] : null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient that changes with mood */}
      <motion.div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: selectedMood
            ? `radial-gradient(ellipse at 50% 0%, var(--mood-${moodColor}-glow) 0%, transparent 50%)`
            : 'transparent',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedMood ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* Ambient orbs */}
      <AnimatePresence mode="wait">
        {selectedMood && (
          <>
            {/* Primary orb - top */}
            <motion.div
              key={`orb-1-${moodColor}`}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
              style={{
                background: `var(--mood-${moodColor}-glow)`,
              }}
              initial={{ opacity: 0, y: -100, scale: 0.5 }}
              animate={{
                opacity: 0.6,
                y: 0,
                scale: 1,
              }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />

            {/* Secondary orb - floating */}
            <motion.div
              key={`orb-2-${moodColor}`}
              className="absolute top-1/3 right-0 w-[300px] h-[300px] rounded-full blur-3xl"
              style={{
                background: `var(--mood-${moodColor}-glow)`,
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: 0.3,
                x: 0,
                y: [0, -20, 0],
              }}
              exit={{ opacity: 0, x: 50 }}
              transition={{
                duration: 1,
                ease: 'easeOut',
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />

            {/* Icon watermark */}
            {IconComponent && (
              <motion.div
                key={`icon-${selectedMood}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
                style={{ color: `var(--mood-${moodColor}-accent)` }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.04, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <IconComponent size={500} />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
