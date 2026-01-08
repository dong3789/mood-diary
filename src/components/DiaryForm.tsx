'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiaryStore } from '@/lib/store';
import { saveEntry } from '@/lib/db';
import { MOOD_CATEGORIES } from '@/lib/constants';
import PhotoUpload from './PhotoUpload';
import { Check, Image, Sparkles } from 'lucide-react';

const PLACEHOLDERS = [
  '오늘 하루는 어땠나요?',
  '무슨 생각을 하고 있나요?',
  '오늘 기억하고 싶은 순간이 있나요?',
  '지금 이 순간의 감정을 적어보세요.',
  '오늘 감사한 일이 있었나요?',
];

export default function DiaryForm() {
  const { selectedMood, selectedDate, content, setContent, photos, resetForm } = useDiaryStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [placeholder] = useState(() =>
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const moodColor = selectedMood ? MOOD_CATEGORIES[selectedMood].color : 'default';

  useEffect(() => {
    if (photos.length > 0) {
      setShowPhotoUpload(true);
    }
  }, [photos.length]);

  const handleSave = async () => {
    if (!selectedMood) return;

    setIsSaving(true);
    try {
      await saveEntry({
        date: selectedDate,
        mood: selectedMood,
        content: content || undefined,
        photos: photos.length > 0 ? photos : undefined,
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        setShowPhotoUpload(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(160, textareaRef.current.scrollHeight)}px`;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md mx-auto px-4"
        >
          {/* Writing Card */}
          <motion.div
            className={`relative rounded-3xl transition-all duration-500 ${
              isFocused ? 'shadow-2xl' : 'shadow-soft'
            }`}
            style={{
              backgroundColor: `var(--mood-${moodColor})`,
            }}
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Subtle top accent */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full opacity-50"
              style={{ backgroundColor: `var(--mood-${moodColor}-accent)` }}
            />

            <div className="p-6 pt-8">
              {/* Writing Area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={handleTextareaChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  className="writing-area w-full min-h-[160px] bg-transparent resize-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400/60 dark:placeholder-gray-500/60 text-lg leading-7"
                  style={{
                    fontFamily: 'var(--font-display), serif',
                  }}
                />

                {/* Character count */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFocused || content.length > 0 ? 0.5 : 0 }}
                  className="absolute bottom-2 right-0 text-xs text-gray-400 dark:text-gray-500"
                >
                  {content.length}자
                </motion.div>
              </div>

              {/* Photo Upload Section */}
              <AnimatePresence>
                {showPhotoUpload && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-black/5 dark:border-white/5"
                  >
                    <PhotoUpload />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5 dark:border-white/5">
                {/* Left Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                    className={`p-2.5 rounded-xl transition-all ${
                      showPhotoUpload || photos.length > 0
                        ? 'bg-black/10 dark:bg-white/10'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      size={20}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    {photos.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-[10px] rounded-full flex items-center justify-center">
                        {photos.length}
                      </span>
                    )}
                  </motion.button>
                </div>

                {/* Save Button */}
                <motion.button
                  onClick={handleSave}
                  disabled={isSaving || showSuccess}
                  className="relative px-6 py-2.5 rounded-xl font-medium text-white transition-all disabled:opacity-70 flex items-center gap-2 overflow-hidden"
                  style={{
                    backgroundColor: `var(--mood-${moodColor}-accent)`,
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <AnimatePresence mode="wait">
                    {showSuccess ? (
                      <motion.span
                        key="success"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={18} />
                        완료
                      </motion.span>
                    ) : isSaving ? (
                      <motion.span
                        key="saving"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        저장 중...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="save"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Sparkles size={16} />
                        저장하기
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Subtle hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4"
          >
            글쓰기에 집중하세요
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
