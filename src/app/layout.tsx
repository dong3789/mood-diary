import type { Metadata, Viewport } from 'next';
import { Noto_Serif_KR, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

// 본문용 - 깔끔한 세리프
const notoSerifKR = Noto_Serif_KR({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// 숫자/제목용 - 세련된 디스플레이 폰트
const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: '무드 다이어리',
  description: '오늘의 감정을 기록하세요',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#fefefe',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSerifKR.variable} ${playfair.variable} antialiased min-h-screen`}
      >
        <Header />
        <main className="pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
