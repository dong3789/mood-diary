'use client';

import { create } from 'zustand';
import { CalendarViewType, DiaryEntry } from '@/types';
import { MoodType } from '@/lib/constants';

interface DiaryState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  selectedMood: MoodType | null;
  setSelectedMood: (mood: MoodType | null) => void;

  content: string;
  setContent: (content: string) => void;

  photos: string[];
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  clearPhotos: () => void;

  calendarView: CalendarViewType;
  setCalendarView: (view: CalendarViewType) => void;

  viewingYear: number;
  viewingMonth: number;
  setViewingYear: (year: number) => void;
  setViewingMonth: (month: number) => void;

  currentEntry: DiaryEntry | null;
  setCurrentEntry: (entry: DiaryEntry | null) => void;

  resetForm: () => void;
  loadEntry: (entry: DiaryEntry) => void;
}

export type { DiaryState };

const getToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const useDiaryStore = create<DiaryState>((set) => ({
  selectedDate: getToday(),
  setSelectedDate: (date) => set({ selectedDate: date }),

  selectedMood: null,
  setSelectedMood: (mood) => set({ selectedMood: mood }),

  content: '',
  setContent: (content) => set({ content }),

  photos: [],
  addPhoto: (photo) => set((state) => ({
    photos: state.photos.length < 3 ? [...state.photos, photo] : state.photos
  })),
  removePhoto: (index) => set((state) => ({
    photos: state.photos.filter((_, i) => i !== index)
  })),
  clearPhotos: () => set({ photos: [] }),

  calendarView: 'month',
  setCalendarView: (view) => set({ calendarView: view }),

  viewingYear: new Date().getFullYear(),
  viewingMonth: new Date().getMonth() + 1,
  setViewingYear: (year) => set({ viewingYear: year }),
  setViewingMonth: (month) => set({ viewingMonth: month }),

  currentEntry: null,
  setCurrentEntry: (entry) => set({ currentEntry: entry }),

  resetForm: () => set({
    selectedMood: null,
    content: '',
    photos: [],
    currentEntry: null,
  }),

  loadEntry: (entry) => set({
    selectedDate: entry.date,
    selectedMood: entry.mood || null,
    content: entry.content || '',
    photos: entry.photos || [],
    currentEntry: entry,
  }),
}));
