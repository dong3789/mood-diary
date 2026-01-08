import { MoodType } from '@/lib/constants';

export interface DiaryEntry {
  id?: number;
  date: string;
  mood: MoodType; // Store selected mood type
  content?: string;
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CalendarViewType = 'month' | 'year';
