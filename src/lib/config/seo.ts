import type { SeoConfig } from '../../types/seo';

export const seoConfig: SeoConfig = {
  // --- Основная информация о сайте ---
  siteName: '3d fabriq',
  // ВАЖНО: Замените URL на ваш реальный домен, когда он будет готов
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://luxe-beige.vercel.app/',
  description: 'Откройте для себя уникальные дизайнерские светильники от 3d fabriq, созданные с помощью 3D-печати. Каталог подвесных светильников, торшеров и ламп из экологичных материалов с доставкой по Беларуси.',
  
  // --- Ключевые слова для поисковых систем ---
  keywords: [
    '3D-печать светильников',
    'дизайнерское освещение',
    'купить светильник Минск',
    'экологичные лампы',
    'торшеры',
    'люстры',
    'бра',
    'освещение для дома',
    'интерьерный свет',
    'кастомные светильники',
    '3d fabriq',
    'современное освещение',
    'светильники Беларусь',
    '3д печать',
    'освещение на заказ',
  ],

  // --- Информация об авторе и издателе ---
  author: '3d fabriq',
  creator: '3d fabriq',
  publisher: '3d fabriq',

  // --- Open Graph метаданные (для Facebook, VK, Telegram и т.д.) ---
  openGraph: {
    type: 'website',
    locale: 'ru_RU', // Русская локаль
    siteName: '3d fabriq',
    images: [
      {
        // ВАЖНО: Создайте и разместите изображение в папке /public
        url: '/logo.png', 
        width: 1200,
        height: 630,
        alt: '3d fabriq - Дизайнерские светильники, созданные с помощью 3D-печати',
      },
    ],
  },

  // --- Twitter метаданные ---
  twitter: {
    card: 'summary_large_image',
    // ВАЖНО: Замените на ваш реальный аккаунт в Twitter/X, если он есть
    creator: '@3dfabriq_by', 
    // Можно использовать то же изображение, что и для Open Graph
    images: ['/logo.png'], 
  },

  // --- Инструкции для поисковых роботов (оставляем как есть, это оптимально) ---
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // --- Коды верификации для поисковых систем ---
  // ВАЖНО: Получите эти коды в Google Search Console и Яндекс.Вебмастер и добавьте их в переменные окружения (.env.local)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || 'your-google-verification-code',
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || 'your-yandex-verification-code',
  },
};