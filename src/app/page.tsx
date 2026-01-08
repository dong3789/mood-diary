'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import BackgroundAura from '@/components/BackgroundAura';
import MoodSelector from '@/components/MoodSelector';
import DiaryForm from '@/components/DiaryForm';
import DateDisplay from '@/components/DateDisplay';
import { useDiaryStore } from '@/lib/store';
import { getEntryByDate } from '@/lib/db';

export default function Home() {
  const { selectedDate, loadEntry, resetForm, selectedMood } = useDiaryStore();

  useEffect(() => {
    const loadTodayEntry = async () => {
      const entry = await getEntryByDate(selectedDate);
      if (entry) {
        loadEntry(entry);
      } else {
        resetForm();
      }
    };
    loadTodayEntry();
  }, [selectedDate]);

  return (
    <div className="min-h-screen pb-20">
      <BackgroundAura />

      <div className="max-w-md mx-auto px-4">
        {/* Date Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pt-6 pb-8"
        >
          <DateDisplay />
        </motion.div>

        {/* Mood Selector - Central Focus */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="pb-8"
        >
          <MoodSelector />
        </motion.div>

        {/* Writing Form - Appears after mood selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: selectedMood ? 1 : 0.3,
            y: selectedMood ? 0 : 20,
          }}
          transition={{ duration: 0.4 }}
        >
          <DiaryForm />
        </motion.div>

        {/* Empty state hint */}
        {!selectedMood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-sm text-gray-400 dark:text-gray-500">
              오늘의 감정을 선택해주세요
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
