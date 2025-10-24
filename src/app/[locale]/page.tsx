"use client"

import { Lightbulb, Lamp, Sun, Moon, Sparkles, Star, ShoppingBag, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import StructuredData from "@/components/StructuredData"
import { motion, Variants } from "framer-motion"
import { useState, useEffect } from "react"

// Определение типа для продукта для лучшей читаемости и безопасности
interface ProductImage {
  url: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: string;
  inStock: boolean;
  images: string[];
  features: string[];
  specifications: {
    brand: string;
    collection: string;
    style: string;
    room: string;
    warranty: string;
    country: string;
  };
}

export default function Home() {
  // Состояния для управления продуктами, загрузкой и ошибками
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Хук для получения данных из API при монтировании компонента
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Запрашиваем только 3 популярных товара для главной страницы
        const response = await fetch('/api/products?limit=3');
        if (!response.ok) {
          throw new Error('Не удалось загрузить товары. Сервер вернул ошибку.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Произошла неизвестная ошибка.");
        // В случае ошибки, можно установить пустой массив, чтобы не ломать рендеринг
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз

  // Тексты преимуществ и шагов теперь заданы напрямую
  const clientBenefits = [
    "Уникальный дизайн, созданный с помощью 3D-печати.",
    "Экологичные материалы и энергоэффективные LED-технологии.",
    "Гарантия качества и быстрая доставка по всей Беларуси.",
  ]
  const proBenefits = [
    "Специальные условия и скидки для дизайнеров и архитекторов.",
    "Возможность кастомизации светильников под ваш проект.",
    "Доступ к 3D-моделям для использования в визуализациях.",
  ]
  const steps = [
    "Выберите светильник",
    "Оформите заказ",
    "Выберите способ оплаты",
    "Получите ваш заказ",
    "Наслаждайтесь светом",
  ]

  // Структурированные данные для SEO
  const websiteData = {
    name: "3d fabriq - Каталог премиального 3D-печатного освещения",
    description:
      "Откройте для себя нашу коллекцию современных и уютных светильников, созданных с помощью 3D-печати. Преобразите свое пространство с помощью элегантных подвесных светильников, торшеров и уникальных решений для освещения.",
    url: "https://digitalfortress.vercel.app", // Замените на ваш URL
  }

  const organizationData = {
    name: "3d fabriq",
    url: "https://digitalfortress.vercel.app", // Замените на ваш URL
    logo: "https://digitalfortress.vercel.app/logo.png", // Замените на ваш URL
  }

  // Анимации
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const floatingVariants: Variants = {
    animate: (i: number) => ({
      y: [0, -15, 0],
      transition: {
        duration: 5 + (i || 0) * 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    }),
  }

  // Иконки
  const clientIcons = [Lightbulb, Star, Heart]
  const proIcons = [Lamp, Sparkles, Sun]
  const stepIcons = [ShoppingBag, Lightbulb, Star, Heart, Sparkles]

  // Категории
  const categories = [
    { name: "Подвесные светильники", icon: Lightbulb, count: "120+" },
    { name: "Торшеры", icon: Lamp, count: "85+" },
    { name: "Настольные лампы", icon: Sun, count: "95+" },
    { name: "Настенные бра", icon: Moon, count: "60+" },
  ]

  return (
    <>
      <StructuredData type="WebSite" data={websiteData} />
      <StructuredData type="Organization" data={organizationData} />

      <div className="min-h-screen pt-4 bg-[#FAF7F2] text-[#2C2416]">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Декоративные элементы */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 bg-[#C17B5C]/5 rounded-full blur-3xl"
              custom={0}
              variants={floatingVariants}
              animate="animate"
            />
            <motion.div
              className="absolute top-40 right-20 w-48 h-48 bg-[#E8DCC8]/10 rounded-full blur-3xl"
              custom={1}
              variants={floatingVariants}
              animate="animate"
            />
            <motion.div
              className="absolute bottom-32 left-1/4 w-40 h-40 bg-[#E8DCC8]/10 rounded-full blur-3xl"
              custom={2}
              variants={floatingVariants}
              animate="animate"
            />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Левый контент */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8DCC8]/50 text-[#2C2416] mb-6 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Новая коллекция 2025</span>
                </motion.div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance font-serif">
                  Осветите Ваше
                  <span className="block text-[#C17B5C] mt-2 z-10">Идеальное пространство</span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-[#6B5D4F] mb-8 leading-relaxed max-w-xl text-pretty font-sans">
                  Откройте для себя нашу тщательно подобранную коллекцию современных светильников, созданных, чтобы привнести тепло и элегантность в каждый уголок вашего дома.
                </p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <Link
                      href="/catalog"
                      className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#FAF7F2] bg-[#C17B5C] hover:bg-[#A66A4D] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl font-sans"
                    >
                      <span className="mr-2">Перейти в каталог</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </Link>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Link
                      href="/contact"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#2C2416] bg-transparent border-2 border-[#E8DCC8] hover:bg-[#E8DCC8]/50 transition-all duration-300 rounded-full font-sans"
                    >
                      Консультация дизайнера
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Правое изображение */}
              <motion.div
                className="relative hidden lg:block"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/uploads/Лампа 3_IMG_1394.JPG"
                    alt="Современный подвесной светильник в уютной гостиной"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/60 to-transparent" />
                </div>

                <motion.div
                  className="absolute -bottom-6 -left-6 bg-white border-2 border-[#E8DCC8] rounded-2xl p-4 sm:p-6 shadow-xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-[#C17B5C]/10 rounded-xl">
                      <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-[#C17B5C]" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm text-[#6B5D4F] font-sans">Энергоэффективность</div>
                      <div className="text-base sm:text-lg font-bold font-serif">LED Технологии</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Секция категорий */}
        <section className="py-16 sm:py-24 bg-[#E8DCC8]/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance font-serif">Исследуйте наши коллекции</h2>
              <p className="text-base sm:text-lg text-[#6B5D4F] max-w-2xl mx-auto text-pretty font-sans">
                От ярких акцентов до утонченных деталей — найдите идеальное освещение для каждой комнаты.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {categories.map((category, i) => {
                const Icon = category.icon
                return (
                  <motion.div
                    key={i}
                    className="group relative bg-white border border-[#E8DCC8] p-6 sm:p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 rounded-2xl cursor-pointer"
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    custom={i}
                  >
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#C17B5C]/10 mb-6 group-hover:bg-[#C17B5C]/20 transition-colors duration-300 rounded-xl">
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#C17B5C]" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 font-serif">{category.name}</h3>
                      {/* <p className="text-[#6B5D4F] text-sm mb-4 font-sans">{category.count} вариантов</p> */}
                      <div className="flex items-center text-[#C17B5C] font-medium text-sm group-hover:gap-2 transition-all font-sans">
                        <span>Смотреть</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Секция преимуществ */}
        <section className="py-16 sm:py-24 bg-[#FAF7F2]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance font-serif">Почему выбирают 3d fabriq</h2>
              <div className="w-24 h-1 bg-[#C17B5C] mx-auto rounded-full mt-6"></div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Для клиентов */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true }}
                className="group relative bg-[#E8DCC8]/30 border border-[#E8DCC8] p-6 sm:p-10 transition-all duration-500 hover:shadow-xl rounded-3xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-[#C17B5C] rounded-xl">
                      <Star className="w-6 h-6 sm:w-7 sm:h-7 text-[#FAF7F2]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif">Для вашего дома</h3>
                  </div>
                  <ul className="space-y-6">
                    {clientBenefits.map((b, i) => {
                      const Icon = clientIcons[i] || Lightbulb
                      return (
                        <motion.li key={i} className="flex items-start gap-4 text-sm sm:text-base" variants={itemVariants}>
                          <div className="p-2 bg-[#C17B5C]/10 mt-1 flex-shrink-0 rounded-lg">
                            <Icon className="w-5 h-5 text-[#C17B5C]" />
                          </div>
                          <span className="leading-relaxed font-medium font-sans">{b}</span>
                        </motion.li>
                      )
                    })}
                  </ul>
                </div>
              </motion.div>

              {/* Для дизайнеров */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{ once: true }}
                className="group relative bg-[#C17B5C]/5 border border-[#C17B5C]/20 p-6 sm:p-10 transition-all duration-500 hover:shadow-xl rounded-3xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-[#C17B5C] rounded-xl">
                      <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-[#FAF7F2]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif">Для дизайнеров</h3>
                  </div>
                  <ul className="space-y-6">
                    {proBenefits.map((b, i) => {
                      const Icon = proIcons[i] || Lamp
                      return (
                        <motion.li key={i} className="flex items-start gap-4 text-sm sm:text-base" variants={itemVariants}>
                          <div className="p-2 bg-[#C17B5C]/10 mt-1 flex-shrink-0 rounded-lg">
                            <Icon className="w-5 h-5 text-[#C17B5C]" />
                          </div>
                          <span className="leading-relaxed font-medium font-sans">{b}</span>
                        </motion.li>
                      )
                    })}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Как это работает */}
        <section className="py-16 sm:py-24 bg-[#E8DCC8]/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance font-serif">Простой процесс покупки</h2>
              <div className="w-24 h-1 bg-[#C17B5C] mx-auto rounded-full mt-6"></div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {steps.map((step, i) => {
                const Icon = stepIcons[i] || Star
                return (
                  <motion.div
                    key={i}
                    className="group relative bg-white border border-[#E8DCC8] p-6 sm:p-8 transition-all duration-500 text-center hover:shadow-xl hover:-translate-y-2 rounded-2xl"
                    initial="hidden"
                    whileInView="visible"
                    variants={containerVariants}
                    viewport={{ once: true }}
                    custom={i}
                  >
                    <div className="relative z-10">
                      <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#C17B5C]/10 mb-4 group-hover:bg-[#C17B5C]/20 transition-all duration-300 rounded-xl">
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#C17B5C]" />
                      </div>
                      <div className="text-xs font-bold text-[#C17B5C] mb-3 tracking-wider uppercase font-sans">
                        Шаг {i + 1}
                      </div>
                      <p className="text-sm font-semibold leading-relaxed font-sans">{step}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Популярные товары */}
        <section className="py-16 sm:py-24 bg-[#FAF7F2]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance font-serif">Популярные светильники</h2>
              <p className="text-base sm:text-lg text-[#6B5D4F] max-w-2xl mx-auto text-pretty font-sans">
                Отобранные вручную хиты из нашей последней коллекции
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {isLoading ? (
                // Рендерим скелетоны во время загрузки
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white border border-[#E8DCC8] rounded-2xl overflow-hidden">
                    <div className="aspect-[3/4] bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
                      <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : error ? (
                // Рендерим сообщение об ошибке
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 px-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Ошибка при загрузке</h3>
                  <p>{error}</p>
                </div>
              ) : (
                // Рендерим товары после успешной загрузки
                products.slice(0, 3).map((item, i) => (
                  <motion.div
                    key={item.id}
                    className="group relative bg-white border border-[#E8DCC8] overflow-hidden transition-all duration-500 hover:shadow-2xl rounded-2xl cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={item.images[0] || "/placeholder.jpg"} // Используем первое изображение или заглушку
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 font-serif">{item.name}</h3>
                      <p className="text-sm text-[#6B5D4F] mb-4 font-sans h-10 overflow-hidden">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl sm:text-2xl font-bold text-[#C17B5C] font-serif">{item.price} Br</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24 bg-[#C17B5C] text-[#FAF7F2] relative overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-10 left-10 w-64 h-64 bg-[#FAF7F2]/5 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-80 h-80 bg-[#FAF7F2]/5 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 4,
              }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance font-serif"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Готовы преобразить ваше пространство?
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed text-[#FAF7F2]/90 text-pretty font-sans"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Присоединяйтесь к тысячам довольных клиентов, которые улучшили свои дома с помощью наших премиальных решений для освещения.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-10 py-3 sm:px-12 sm:py-4 text-base sm:text-lg font-semibold text-[#C17B5C] bg-[#FAF7F2] hover:bg-[#FAF7F2]/90 transition-all duration-300 rounded-full shadow-2xl hover:shadow-3xl font-sans"
              >
                <span className="mr-2">Начать покупки</span>
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-[#E8DCC8]/30 border-t border-[#E8DCC8]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex flex-col items-center gap-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#C17B5C] rounded-xl">
                  <Lightbulb className="w-6 h-6 text-[#FAF7F2]" />
                </div>
                <span className="text-2xl font-bold font-serif">3d fabriq</span>
              </div>
              <p className="text-sm sm:text-base text-[#6B5D4F] leading-relaxed max-w-2xl text-pretty font-sans">
                Освещаем дома со стилем и изысканностью. Качественное исполнение, вечный дизайн и исключительное обслуживание клиентов.
              </p>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#6B5D4F] font-sans">
                <Link href="#" className="hover:text-[#C17B5C] transition-colors">
                  О нас
                </Link>
                <Link href="/catalog" className="hover:text-[#C17B5C] transition-colors">
                  Коллекции
                </Link>
                <Link href="/contact" className="hover:text-[#C17B5C] transition-colors">
                  Контакты
                </Link>
                <Link href="#" className="hover:text-[#C17B5C] transition-colors">
                  Поддержка
                </Link>
              </div>
              <div className="w-16 h-1 bg-[#C17B5C] rounded-full mt-4"></div>
              <p className="text-xs text-[#6B5D4F] font-sans">© 2025 3d fabriq. Все права защищены.</p>
            </motion.div>
          </div>
        </footer>
      </div>
    </>
  )
}