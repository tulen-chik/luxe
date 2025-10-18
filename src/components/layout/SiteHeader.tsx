"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Lamp } from 'lucide-react'; // Заменили иконку
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

interface Props {
  locale: string;
}

export default function SiteHeader({ locale }: Props) {
  const pathname = usePathname();
  const t = useTranslations('common');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Эффект для отслеживания прокрутки
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Эффект для закрытия меню при изменении маршрута
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  // Эффект для блокировки прокрутки при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const nav = [
    { href: `/${locale}/catalog`, label: "Каталог" },
    { href: `/${locale}/contact`, label: "Контакты" },
    // { href: `/${locale}/chat`, label: t('header.nav.chat') },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  // Варианты анимации для Framer Motion
  const headerVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const mobileMenuVariants: Variants = {
    hidden: { x: '100%', transition: { duration: 0.3, ease: 'easeIn' } },
    visible: { x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const navItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.4,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-[#FAF7F2]/80 backdrop-blur-lg' : 'bg-[#FAF7F2]'
        } border-b-2 border-[#E8DCC8]`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`} className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-[#C17B5C] transition-colors duration-300 rounded-lg"
                >
                  
                  <Image src="/3DFT.png" alt="Logo" width={100} height={100} />
                </motion.div>
              </Link>
              <nav className="hidden md:flex items-center gap-1 ml-4">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative px-4 py-2 text-sm font-bold transition-colors duration-300 font-sans rounded-lg ${
                        active ? 'text-[#FAF7F2]' : 'text-[#6B5D4F] hover:text-[#2C2416]'
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute inset-0 bg-[#C17B5C] rounded-lg z-0"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{item.label.toUpperCase()}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 text-[#2C2416] hover:bg-[#E8DCC8] border-2 border-transparent hover:border-[#E8DCC8] transition-all duration-300 rounded-lg"
                aria-label={t('header.openMenu')}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-50 bg-[#2C2416]/50 backdrop-blur-sm"
          >
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-[#FAF7F2] border-l-2 border-[#E8DCC8] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b-2 border-[#E8DCC8]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#C17B5C] rounded-lg">
                    <Lamp className="w-5 h-5 text-[#FAF7F2]" />
                  </div>
                  <span className="font-bold text-lg text-[#2C2416] font-serif">{t('header.brand')}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-[#2C2416] hover:bg-[#E8DCC8] transition-all duration-300 rounded-lg"
                  aria-label={t('header.closeMenu')}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <nav className="flex-grow p-4 flex flex-col gap-2">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.href}
                    custom={i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={item.href}
                      className={`block text-center px-4 py-3 text-base font-bold transition-all duration-300 font-sans border-2 rounded-lg ${
                        isActive(item.href)
                          ? 'text-[#FAF7F2] bg-[#C17B5C] border-[#C17B5C]'
                          : 'text-[#6B5D4F] bg-transparent border-[#E8DCC8] hover:border-[#C17B5C] hover:text-[#2C2416]'
                      }`}
                    >
                      {item.label.toUpperCase()}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}