'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDiaryStore } from '@/lib/store';
import { getEntriesByYear } from '@/lib/db';
import { MONTHS, MOOD_CATEGORIES } from '@/lib/constants';
import { DiaryEntry } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function YearlyCalendar() {
  const router = useRouter();
  const { viewingYear, setViewingYear, setViewingMonth, setCalendarView, setSelectedDate, loadEntry } = useDiaryStore();
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({});

  useEffect(() => {
    const fetchEntries = async () => {
      const data = await getEntriesByYear(viewingYear);
      const entriesMap: Record<string, DiaryEntry> = {};
      data.forEach((entry) => {
        entriesMap[entry.date] = entry;
      });
      setEntries(entriesMap);
    };
    fetchEntries();
  }, [viewingYear]);

  const getDaysInMonth = (month: number) => {
    return new Date(viewingYear, month, 0).getDate();
  };

  const handleDayClick = (month: number, day: number) => {
    const dateStr = `${viewingYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setViewingMonth(month);
    setCalendarView('month');

    const entry = entries[dateStr];
    if (entry) {
      loadEntry(entry);
    }
    router.push('/');
  };

  const getDateString = (month: number, day: number) => {
    return `${viewingYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const totalEntries = Object.keys(entries).length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={() => setViewingYear(viewingYear - 1)}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} className="text-gray-500 dark:text-gray-400" />
        </motion.button>

        <motion.h2
          key={viewingYear}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-gray-800 dark:text-white"
          style={{ fontFamily: 'var(--font-display), serif' }}
        >
          {viewingYear}
        </motion.h2>

        <motion.button
          onClick={() => setViewingYear(viewingYear + 1)}
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} className="text-gray-500 dark:text-gray-400" />
        </motion.button>
      </div>

      {/* Months Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-3 sm:grid-cols-4 gap-3"
      >
        {MONTHS.map((monthName, monthIndex) => {
          const month = monthIndex + 1;
          const daysInMonth = getDaysInMonth(month);
          const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
          const monthEntries = days.filter(day => entries[getDateString(month, day)]).length;

          return (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: monthIndex * 0.03 }}
              className="rounded-2xl p-3 glass shadow-soft"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {monthName}
                </h3>
                {monthEntries > 0 && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {monthEntries}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-7 gap-[2px]">
                {days.map((day) => {
                  const dateStr = getDateString(month, day);
                  const entry = entries[dateStr];
                  const mood = entry?.mood;
                  const moodColor = mood ? MOOD_CATEGORIES[mood].color : null;
                  const isToday = dateStr === todayStr;

                  return (
                    <motion.button
                      key={day}
                      onClick={() => handleDayClick(month, day)}
                      className={`aspect-square rounded-[3px] flex items-center justify-center transition-all relative ${
                        isToday ? 'ring-1 ring-gray-800 dark:ring-white' : ''
                      }`}
                      style={{
                        backgroundColor: moodColor
                          ? `var(--mood-${moodColor})`
                          : 'var(--mood-default)',
                      }}
                      whileHover={{ scale: 2, zIndex: 10 }}
                      title={`${month}/${day}`}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Year Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center space-y-1"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          올해 <span className="font-semibold text-gray-800 dark:text-white">{totalEntries}</span>일 기록
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          나만의 감정으로 채워가는 한 해
        </p>
      </motion.div>
    </div>
  );
}
