'use client';

import { SVGProps } from 'react';

interface MoodIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// 미니멀한 일러스트 스타일의 감정 아이콘들
export function HappyIcon({ size = 48, ...props }: MoodIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* 얼굴 */}
      <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.1" />
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
      {/* 눈 - 웃는 초승달 모양 */}
      <path
        d="M15 20C15 20 16 18 18 18C20 18 21 20 21 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27 20C27 20 28 18 30 18C32 18 33 20 33 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 입 - 큰 미소 */}
      <path
        d="M16 28C16 28 18 33 24 33C30 33 32 28 32 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 볼터치 */}
      <circle cx="13" cy="27" r="2" fill="currentColor" fillOpacity="0.3" />
      <circle cx="35" cy="27" r="2" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

export function NeutralIcon({ size = 48, ...props }: MoodIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* 얼굴 */}
      <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.1" />
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
      {/* 눈 - 무표정 수평선 (-_-) */}
      <line
        x1="14"
        y1="22"
        x2="22"
        y2="22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="26"
        y1="22"
        x2="34"
        y2="22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 입 - 무표정 수평선 */}
      <line
        x1="19"
        y1="31"
        x2="29"
        y2="31"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WorriedIcon({ size = 48, ...props }: MoodIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* 얼굴 */}
      <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.1" />
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
      {/* 눈썹 - 걱정스러운 */}
      <path
        d="M14 16L20 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M34 16L28 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* 눈 */}
      <circle cx="17" cy="22" r="2" fill="currentColor" />
      <circle cx="31" cy="22" r="2" fill="currentColor" />
      {/* 입 - 불안한 물결 */}
      <path
        d="M18 31C18 31 20 29 24 29C28 29 30 31 30 31"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SadIcon({ size = 48, ...props }: MoodIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* 얼굴 */}
      <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.1" />
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
      {/* 눈 - 슬픈 눈 */}
      <circle cx="17" cy="21" r="2" fill="currentColor" />
      <circle cx="31" cy="21" r="2" fill="currentColor" />
      {/* 눈물 */}
      <path
        d="M17 25C17 25 16 28 17 30C18 28 17 25 17 25Z"
        fill="currentColor"
        fillOpacity="0.5"
      />
      {/* 입 - 아래로 향한 곡선 */}
      <path
        d="M18 33C18 33 20 29 24 29C28 29 30 33 30 33"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AngryIcon({ size = 48, ...props }: MoodIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* 얼굴 */}
      <circle cx="24" cy="24" r="20" fill="currentColor" fillOpacity="0.1" />
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
      {/* 눈썹 - 화난 */}
      <path
        d="M13 18L21 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M35 18L27 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* 눈 - 날카로운 */}
      <circle cx="17" cy="24" r="2" fill="currentColor" />
      <circle cx="31" cy="24" r="2" fill="currentColor" />
      {/* 입 - 찡그린 */}
      <path
        d="M18 33C18 33 21 31 24 31C27 31 30 33 30 33"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 아이콘 매핑
export const MoodIconComponents = {
  happy: HappyIcon,
  neutral: NeutralIcon,
  worried: WorriedIcon,
  sad: SadIcon,
  angry: AngryIcon,
} as const;

export type MoodIconType = keyof typeof MoodIconComponents;
