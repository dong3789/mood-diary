'use client';

import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useDiaryStore } from '@/lib/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DateDisplay() {
  const { selectedDate, setSelectedDate } = useDiaryStore();

  const date = new Date(selectedDate + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = format(date, 'EEEE', { locale: ko });
  const year = date.getFullYear();

  const getRelativeDay = () => {
    if (isToday(date)) return '오늘';
    if (isYesterday(date)) return '어제';
    if (isTomorrow(date)) return '내일';
    return null;
  };

  const relativeDay = getRelativeDay();

  const navigateDate = (direction: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(format(newDate, 'yyyy-MM-dd'));
  };

  const goToToday = () => {
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      {/* Year - subtle */}
      <span
        className="text-xs text-gray-400 dark:text-gray-500 tracking-widest"
        style={{ fontFamily: 'var(--font-display), serif' }}
      >
        {year}
      </span>

      {/* Main Date with Navigation */}
      <div className="flex items-center gap-4 mt-1">
        <motion.button
          onClick={() => navigateDate(-1)}
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={18} />
        </motion.button>

        <motion.button
          onClick={goToToday}
          className="flex flex-col items-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl text-gray-800 dark:text-white">
            <span
              className="font-semibold"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              {month}
            </span>
            <span className="text-gray-400 dark:text-gray-500 mx-1">월</span>
            <span
              className="font-semibold"
              style={{ fontFamily: 'var(--font-display), serif' }}
            >
              {day}
            </span>
            <span className="text-gray-400 dark:text-gray-500 ml-1">일</span>
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {relativeDay ? (
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {relativeDay}
              </span>
            ) : (
              dayOfWeek
            )}
          </span>
        </motion.button>

        <motion.button
          onClick={() => navigateDate(1)}
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
