'use client';

import { motion } from 'framer-motion';
import { useDiaryStore } from '@/lib/store';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import YearlyCalendar from '@/components/YearlyCalendar';

export default function CalendarPage() {
  const calendarView = useDiaryStore((state) => state.calendarView);

  return (
    <div className="min-h-screen pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-4"
      >
        {calendarView === 'month' ? <MonthlyCalendar /> : <YearlyCalendar />}
      </motion.div>
    </div>
  );
}
