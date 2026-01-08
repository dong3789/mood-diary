'use client';

import { useRef, useCallback } from 'react';
import { useDiaryStore } from '@/lib/store';
import { MOOD_CATEGORIES, type MoodType } from '@/lib/constants';
import { MoodIconComponents } from './icons/MoodIcons';

const MOODS = Object.keys(MOOD_CATEGORIES) as MoodType[];

export default function MoodSelector() {
  const { selectedMood, setSelectedMood } = useDiaryStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSelectedRef = useRef<MoodType | null>(null);

  const getMoodFromPoint = useCallback((clientX: number, clientY: number): MoodType | null => {
    const element = document.elementFromPoint(clientX, clientY);
    const moodButton = element?.closest('[data-mood]') as HTMLElement | null;
    return moodButton?.dataset.mood as MoodType | null;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const mood = getMoodFromPoint(e.clientX, e.clientY);
    if (mood) {
      setSelectedMood(mood);
      lastSelectedRef.current = mood;
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [getMoodFromPoint, setSelectedMood]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons === 0) return;
    const mood = getMoodFromPoint(e.clientX, e.clientY);
    if (mood && mood !== lastSelectedRef.current) {
      setSelectedMood(mood);
      lastSelectedRef.current = mood;
    }
  }, [getMoodFromPoint, setSelectedMood]);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Single row mood selector with drag support */}
      <div
        ref={containerRef}
        className="flex items-center justify-center gap-2 touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        {MOODS.map((mood) => {
          const category = MOOD_CATEGORIES[mood];
          const isSelected = selectedMood === mood;
          const IconComponent = MoodIconComponents[mood];

          return (
            <div
              key={mood}
              data-mood={mood}
              className={`p-3 rounded-2xl transition-all duration-100 cursor-pointer ${
                isSelected ? 'scale-110 shadow-soft' : ''
              }`}
              style={{
                backgroundColor: isSelected
                  ? `var(--mood-${category.color})`
                  : 'transparent',
                color: isSelected
                  ? `var(--mood-${category.color}-accent)`
                  : 'var(--foreground)',
              }}
            >
              <IconComponent size={44} />
            </div>
          );
        })}
      </div>

      {/* Mood Label */}
      {selectedMood && (
        <p
          className="mt-4 text-lg transition-colors duration-100"
          style={{
            color: `var(--mood-${MOOD_CATEGORIES[selectedMood].color}-accent)`,
            fontFamily: 'var(--font-display), cursive',
          }}
        >
          {MOOD_CATEGORIES[selectedMood].label}
        </p>
      )}
    </div>
  );
}
