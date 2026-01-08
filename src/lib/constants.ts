// Mood categories with icon types and colors
export const MOOD_CATEGORIES = {
  happy: {
    icon: 'happy',
    label: '행복해요',
    color: 'happy',
  },
  neutral: {
    icon: 'neutral',
    label: '평온해요',
    color: 'neutral',
  },
  worried: {
    icon: 'worried',
    label: '걱정돼요',
    color: 'worried',
  },
  sad: {
    icon: 'sad',
    label: '슬퍼요',
    color: 'sad',
  },
  angry: {
    icon: 'angry',
    label: '화나요',
    color: 'angry',
  },
} as const;

export type MoodType = keyof typeof MOOD_CATEGORIES;

// 유효한 MoodType인지 확인
export function isValidMoodType(mood: string): mood is MoodType {
  return mood in MOOD_CATEGORIES;
}

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const MONTHS = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];
