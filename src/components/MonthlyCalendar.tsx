'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiaryStore } from '@/lib/store';
import { getEntriesByMonth } from '@/lib/db';
import { WEEKDAYS, MOOD_CATEGORIES } from '@/lib/constants';
import { DiaryEntry } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MoodIconComponents } from './icons/MoodIcons';

export default function MonthlyCalendar() {
  const router = useRouter();
  const { viewingYear, viewingMonth, setViewingYear, setViewingMonth, setSelectedDate, loadEntry } = useDiaryStore();
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({});

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getEntriesByMonth(viewingYear, viewingMonth);
      const entriesMap: Record<string, DiaryEntry> = {};
      data.forEach((entry) => {
        entriesMap[entry.date] = entry;
      });
      setEntries(entriesMap);
    };
    fetchEntries();
  }, [viewingYear, viewingMonth]);

  const getDaysInMonth = () => {
    const firstDay = new Date(viewingYear, viewingMonth - 1, 1);
    const lastDay = new Date(viewingYear, viewingMonth, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (viewingMonth === 1) {
      setViewingYear(viewingYear - 1);
      setViewingMonth(12);
    } else {
      setViewingMonth(viewingMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewingMonth === 12) {
      setViewingYear(viewingYear + 1);
      setViewingMonth(1);
    } else {
      setViewingMonth(viewingMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${viewingYear}-${String(viewingMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);

    const entry = entries[dateStr];
    if (entry) {
      loadEntry(entry);
    }
    router.push('/');
  };

  const getDateString = (day: number) => {
    return `${viewingYear}-${String(viewingMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const days = getDaysInMonth();

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={handlePrevMonth}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </motion.button>

        <motion.h2
          key={`${viewingYear}-${viewingMonth}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold text-gray-800 dark:text-white"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          {viewingYear}년 {viewingMonth}월
        </motion.h2>

        <motion.button
          onClick={handleNextMonth}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} className="text-gray-500 dark:text-gray-400" />
        </motion.button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-2 ${
              index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewingYear}-${viewingMonth}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1.5"
        >
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = getDateString(day);
            const entry = entries[dateStr];
            const isToday = dateStr === todayStr;
            const mood = entry?.mood;
            const moodColor = mood ? MOOD_CATEGORIES[mood].color : null;
            const dayOfWeek = (index % 7);
            const IconComponent = mood ? MoodIconComponents[mood] : null;

            return (
              <motion.button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all overflow-hidden ${
                  isToday
                    ? 'ring-2 ring-gray-800 dark:ring-white'
                    : ''
                }`}
                style={{
                  backgroundColor: moodColor
                    ? `var(--mood-${moodColor})`
                    : 'transparent',
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className={`text-xs font-medium ${
                    mood
                      ? 'text-gray-600 dark:text-gray-300'
                      : dayOfWeek === 0
                      ? 'text-red-400/70'
                      : dayOfWeek === 6
                      ? 'text-blue-400/70'
                      : 'text-gray-400 dark:text-gray-500'
                  } ${isToday ? 'font-bold' : ''}`}
                >
                  {day}
                </span>
                {IconComponent && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-0.5"
                    style={{ color: `var(--mood-${moodColor}-accent)` }}
                  >
                    <IconComponent size={20} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {Object.keys(entries).length}일 기록됨
        </p>
      </motion.div>
    </div>
  );
}
