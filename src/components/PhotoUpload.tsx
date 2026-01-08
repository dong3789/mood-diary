'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiaryStore } from '@/lib/store';
import { Plus, X } from 'lucide-react';

export default function PhotoUpload() {
  const { photos, addPhoto, removePhoto } = useDiaryStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      addPhoto(result);
    };
    reader.readAsDataURL(file);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {/* Photo Grid */}
      <div className="flex gap-2 flex-wrap">
        <AnimatePresence mode="popLayout">
          {photos.map((photo, index) => (
            <motion.div
              key={`photo-${index}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative group"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white/50 dark:ring-black/20 shadow-soft">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                whileTap={{ scale: 0.9 }}
              >
                <X size={14} />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Photo Button */}
        {photos.length < 3 && (
          <motion.button
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300/50 dark:border-gray-600/50 flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-500 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-all hover:bg-white/30 dark:hover:bg-black/10"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plus size={20} strokeWidth={1.5} />
            <span className="text-[10px]">사진 추가</span>
          </motion.button>
        )}
      </div>

      {/* Photo count indicator */}
      {photos.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-xs text-gray-500 dark:text-gray-400"
        >
          {photos.length}/3
        </motion.p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
