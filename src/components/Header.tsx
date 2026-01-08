'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { PenLine, CalendarDays } from 'lucide-react';
import { useDiaryStore } from '@/lib/store';

export default function Header() {
  const pathname = usePathname();
  const { calendarView, setCalendarView } = useDiaryStore();

  const isHome = pathname === '/';
  const isCalendar = pathname === '/calendar';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto px-4 py-3">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          {/* Main Navigation Pills */}
          <div className="flex items-center gap-1 p-1 rounded-2xl glass shadow-soft">
            <Link href="/">
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isHome
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <PenLine size={16} />
                <span className="text-sm font-medium">기록</span>
              </motion.div>
            </Link>

            <Link href="/calendar">
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isCalendar
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <CalendarDays size={16} />
                <span className="text-sm font-medium">캘린더</span>
              </motion.div>
            </Link>
          </div>

          {/* Calendar View Toggle */}
          {isCalendar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center p-1 rounded-xl glass shadow-soft"
            >
              <button
                onClick={() => setCalendarView('month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  calendarView === 'month'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                월
              </button>
              <button
                onClick={() => setCalendarView('year')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  calendarView === 'year'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                년
              </button>
            </motion.div>
          )}
        </motion.nav>
      </div>
    </header>
  );
}
