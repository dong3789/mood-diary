'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, Trash2, Edit3, Save, X } from 'lucide-react';
import { getEntryByDate, saveEntry, deleteEntry } from '@/lib/db';
import { DiaryEntry } from '@/types';
import { MOOD_CATEGORIES, type MoodType } from '@/lib/constants';
import { MoodIconComponents } from '@/components/icons/MoodIcons';

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dateStr = params.date as string;

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [editMood, setEditMood] = useState<MoodType | null>(null);
  const [editContent, setEditContent] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEntry = async () => {
      const data = await getEntryByDate(dateStr);
      if (data) {
        setEntry(data);
        setEditMood(data.mood || null);
        setEditContent(data.content || '');
      }
      setIsLoading(false);
    };
    loadEntry();
  }, [dateStr]);

  const handleMoodChange = (mood: MoodType) => {
    setEditMood(mood);
  };

  const handleSave = async () => {
    if (!editMood) return;

    await saveEntry({
      date: dateStr,
      mood: editMood,
      content: editContent || undefined,
      photos: entry?.photos,
    });

    const updated = await getEntryByDate(dateStr);
    if (updated) {
      setEntry(updated);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!entry?.id) return;

    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteEntry(entry.id);
      router.push('/calendar');
    }
  };

  const date = new Date(dateStr + 'T00:00:00');
  const formattedDate = format(date, 'M월 d일', { locale: ko });
  const dayOfWeek = format(date, 'EEEE', { locale: ko });
  const year = format(date, 'yyyy', { locale: ko });

  const currentMood = isEditing ? editMood : entry?.mood;
  const moodColor = currentMood ? MOOD_CATEGORIES[currentMood].color : 'default';
  const IconComponent = currentMood ? MoodIconComponents[currentMood] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 dark:text-gray-500"
        >
          로딩 중...
        </motion.div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-500 dark:text-gray-400">해당 날짜에 기록이 없습니다.</p>
        <motion.button
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl text-sm font-medium glass shadow-soft"
          whileTap={{ scale: 0.95 }}
        >
          돌아가기
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Background Aura */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ background: `var(--mood-${moodColor}-glow)` }}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 0.5, y: 0 }}
        />
        {IconComponent && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
            style={{ color: `var(--mood-${moodColor}-accent)` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.04, scale: 1 }}
          >
            <IconComponent size={400} />
          </motion.div>
        )}
      </div>

      <div className="max-w-md mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={() => router.back()}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
          </motion.button>

          <div className="flex gap-1">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex gap-1"
                >
                  <motion.button
                    onClick={() => setIsEditing(false)}
                    className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <X size={18} className="text-gray-500" />
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    className="p-2.5 rounded-xl text-white"
                    style={{ backgroundColor: `var(--mood-${moodColor}-accent)` }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Save size={18} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="viewing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex gap-1"
                >
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit3 size={18} className="text-gray-500" />
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Date Display */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-xs text-gray-400 dark:text-gray-500">{year}</span>
          <h1
            className="text-2xl font-semibold text-gray-800 dark:text-white mt-1"
            style={{ fontFamily: 'var(--font-display), serif' }}
          >
            {formattedDate}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{dayOfWeek}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Mood Selector */}
              <div
                className="p-5 rounded-3xl"
                style={{ backgroundColor: `var(--mood-${moodColor})` }}
              >
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">
                  기분 수정하기
                </p>
                <div className="flex justify-center gap-3">
                  {(Object.keys(MOOD_CATEGORIES) as MoodType[]).map((mood) => {
                    const category = MOOD_CATEGORIES[mood];
                    const isSelected = editMood === mood;
                    const MoodIcon = MoodIconComponents[mood];

                    return (
                      <motion.button
                        key={mood}
                        onClick={() => handleMoodChange(mood)}
                        className={`p-3 rounded-xl transition-all ${
                          isSelected ? 'bg-white/50 dark:bg-black/20 shadow-sm scale-110' : ''
                        }`}
                        style={{
                          color: isSelected
                            ? `var(--mood-${category.color}-accent)`
                            : 'currentColor',
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MoodIcon size={32} />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Content Editor */}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="내용을 입력하세요..."
                className="writing-area w-full min-h-[200px] p-5 rounded-3xl resize-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400/60"
                style={{
                  backgroundColor: `var(--mood-${moodColor})`,
                  fontFamily: 'var(--font-display), serif',
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="view-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Mood Display */}
              <div className="flex flex-col items-center">
                {IconComponent && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="mb-3 gentle-float"
                    style={{ color: `var(--mood-${moodColor}-accent)` }}
                  >
                    <IconComponent size={80} />
                  </motion.div>
                )}
                {currentMood && (
                  <span
                    className="text-sm font-medium"
                    style={{ color: `var(--mood-${moodColor}-accent)` }}
                  >
                    {MOOD_CATEGORIES[currentMood].label}
                  </span>
                )}
              </div>

              {/* Content */}
              {entry.content && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-3xl"
                  style={{ backgroundColor: `var(--mood-${moodColor})` }}
                >
                  <p
                    className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-7"
                    style={{ fontFamily: 'var(--font-display), serif' }}
                  >
                    {entry.content}
                  </p>
                </motion.div>
              )}

              {/* Photos */}
              {entry.photos && entry.photos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {entry.photos.map((photo, index) => (
                    <motion.img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-2xl shadow-soft"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Timestamp */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4"
              >
                {format(new Date(entry.createdAt), 'yyyy.MM.dd HH:mm', { locale: ko })} 작성
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
