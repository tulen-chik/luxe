"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lamp, Lightbulb, Sparkles, Filter, Search, ChevronDown, X, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

// 1. Определяем тип данных, который мы ожидаем от API
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

const categories = [
  { value: "all", label: "Все", icon: Sparkles },
  { value: "pendant", label: "Подвесные", icon: Lamp },
  { value: "floor", label: "Торшеры", icon: Lightbulb },
  { value: "table", label: "Настольные", icon: Lamp },
  { value: "decor", label: "Декор", icon: Sparkles },
  { value: "wall", label: "Настенные", icon: Lamp },
];

// Компонент скелета для карточки товара
const ProductCardSkeleton = () => (
  <div className="group flex flex-col h-full overflow-hidden border-2 border-[#E8DCC8] rounded-xl bg-white">
    <div className="relative aspect-square overflow-hidden bg-[#E8DCC8]/40 animate-pulse"></div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="h-6 w-3/4 bg-[#E8DCC8]/40 rounded animate-pulse mb-4"></div>
      <div className="h-4 w-1/2 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
      <div className="flex items-end justify-between mt-auto pt-4">
        <div className="h-8 w-1/3 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
        <div className="h-6 w-1/4 bg-[#E8DCC8]/40 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);


export default function CatalogPage() {
  // 2. Состояния для данных, загрузки и ошибок
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояния для фильтров остаются без изменений
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // 3. Загружаем данные с API при монтировании компонента
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Имитация задержки сети для демонстрации скелета
        await new Promise(resolve => setTimeout(resolve, 1500));
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Не удалось загрузить товары. Сервер вернул ошибку.');
        }
        const data = await response.json();
        setAllProducts(data);
      } catch (err: any) {
        setError(err.message || "Произошла неизвестная ошибка.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // 4. Логика фильтрации и сортировки теперь работает с состоянием `allProducts`
  const filteredProducts = allProducts
    .filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const sortOptions = [
    { value: "featured", label: "Рекомендуемые" },
    { value: "price-asc", label: "Цена: по возрастанию" },
    { value: "price-desc", label: "Цена: по убыванию" },
  ];

  const FilterPanel = () => (
    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between w-full pt-4 lg:pt-0">
      {/* Search */}
      <div className="relative w-full lg:w-auto lg:flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B5D4F]" />
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border-2 border-[#E8DCC8] rounded-xl focus:outline-none focus:border-[#C17B5C] transition-colors bg-[#FAF7F2] text-[#2C2416] font-sans"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center bg-[#E8DCC8]/50 p-1 rounded-xl">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors font-sans text-sm ${
                isActive ? "text-[#FAF7F2]" : "text-[#6B5D4F] hover:text-[#2C2416]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="category-pill"
                  className="absolute inset-0 bg-[#C17B5C] rounded-lg z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown */}
      <div className="relative w-full lg:w-56">
        <button
          onClick={() => setShowSortDropdown(!showSortDropdown)}
          className="w-full flex items-center justify-between px-4 py-3 border-2 border-[#E8DCC8] rounded-xl bg-[#FAF7F2] text-[#2C2416] hover:border-[#C17B5C] transition-colors font-sans"
        >
          <span>{sortOptions.find((opt) => opt.value === sortBy)?.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {showSortDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 w-full bg-white border-2 border-[#E8DCC8] rounded-lg shadow-lg overflow-hidden z-20" // Увеличил z-index на всякий случай
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-[#E8DCC8]/60 transition-colors font-sans ${
                    sortBy === option.value ? "bg-[#E8DCC8] font-semibold" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  // 5. Функция для рендеринга контента в зависимости от состояния
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-32">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2C2416] mb-2 font-serif">Ошибка загрузки</h3>
          <p className="text-[#6B5D4F] font-sans">{error}</p>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Filter className="w-16 h-16 text-[#6B5D4F] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2C2416] mb-2 font-serif">Ничего не найдено</h3>
          <p className="text-[#6B5D4F] font-sans">Попробуйте изменить параметры поиска или фильтры</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProducts.map((product) => (
          <Link href={`/catalog/${product.id}`} key={product.id} passHref>
            <motion.div variants={itemVariants} className="h-full cursor-pointer">
              <div className="group flex flex-col h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-[#E8DCC8] rounded-xl bg-white">
                <div className="relative aspect-square overflow-hidden bg-[#E8DCC8]/20">
                  {/* Используем первое изображение из массива */}
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="px-3 py-1 bg-[#6B5D4F] text-[#FAF7F2] text-xs font-bold rounded-full font-sans">
                        Нет в наличии
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg mb-2 text-[#2C2416] line-clamp-2 font-serif flex-grow">
                    {product.name}
                  </h3>
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-left items-center gap-2">
                    <span className="text-2xl font-bold text-[#C17B5C] font-serif">
                      {product.price} Br
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="text-lg text-[#6B5D4F] line-through font-serif">
                        {product.oldPrice} Br
                      </span>
                    )}
                    </div>

                    <div className="flex items-center gap-1 text-[#C17B5C] font-semibold font-sans group-hover:gap-2 transition-all">
                      <span>Перейти</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section className="py-6 border-b border-[#E8DCC8] bg-white/80 backdrop-blur-lg sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all font-sans text-sm bg-[#FAF7F2] text-[#2C2416] border-2 border-[#E8DCC8] hover:border-[#C17B5C]"
            >
              {isFilterOpen ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              <span>Фильтры</span>
            </button>
          </div>
          <AnimatePresence>
            {isFilterOpen && !isDesktop && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="" // <-- ИЗМЕНЕНИЕ ЗДЕСЬ
              >
                <FilterPanel />
              </motion.div>
            )}
          </AnimatePresence>
          {isDesktop && <FilterPanel />}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {renderContent()}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#FAF7F2] to-[#E8DCC8]/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Sparkles className="w-12 h-12 text-[#C17B5C] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2C2416] font-serif">Не нашли то, что искали?</h2>
            <p className="text-lg text-[#6B5D4F] mb-8 font-sans">
              Свяжитесь с нами, и мы поможем подобрать идеальное освещение для вашего интерьера
            </p>
            <Link href="/contact" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#C17B5C] text-[#FAF7F2] rounded-lg font-semibold hover:bg-[#A66A4D] transition-all font-sans"
              >
                Связаться с нами
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}