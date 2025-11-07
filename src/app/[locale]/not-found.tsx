'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AlertTriangle, ArrowRight } from 'lucide-react'; // Импортируем иконки
import { motion } from 'framer-motion'; // Импортируем для анимации

export default function NotFound() {
  // Хук для локализации остается без изменений
  const t = useTranslations('common');

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      // Используем основной фон вашего приложения
      className="min-h-screen flex items-center justify-center bg-[#FAF7F2] p-4"
    >
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          {/* Добавляем иконку в фирменном цвете */}
          <AlertTriangle className="w-16 h-16 text-[#C17B5C] mx-auto mb-6" />

          {/* Стилизуем текст под ваш дизайн */}
          <h1 className="text-8xl font-bold text-[#2C2416] font-serif mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#2C2416] font-serif mb-2">
            {t('notFoundTitle')}
          </h2>
          <p className="text-lg text-[#6B5D4F] font-sans">
            {t('notFoundDescription')}
          </p>
        </div>

        {/* 
          Стилизуем ссылку как основную кнопку вашего приложения.
          Ссылка ведет на главную страницу каталога.
        */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#C17B5C] text-[#FAF7F2] rounded-lg font-semibold hover:bg-[#A66A4D] transition-all font-sans active:scale-95"
        >
          {t('backToHome')}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.main>
  );
}