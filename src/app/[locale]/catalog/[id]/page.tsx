"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  Send,
  Loader,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// 1. Определяем тип данных, который мы ожидаем от API
// Этот тип должен быть таким же, как в админ-панели
interface Product {
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

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  // 2. Состояния для данных, загрузки и ошибок
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);

  // 3. Загружаем данные с API при монтировании компонента
  useEffect(() => {
    if (!productId) return; // Не делаем запрос, если ID еще не доступен

    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Загружаем основной товар
        const productRes = await fetch(`/api/products/${productId}`);
        if (!productRes.ok) {
          if (productRes.status === 404) {
            throw new Error("Товар не найден");
          }
          throw new Error("Не удалось загрузить данные о товаре");
        }
        const productData: Product = await productRes.json();
        setProduct(productData);

        // Загружаем все товары для секции "Похожие товары"
        const allProductsRes = await fetch('/api/products');
        if (!allProductsRes.ok) {
            // Не критичная ошибка, просто не покажем похожие товары
            console.error("Не удалось загрузить похожие товары");
            return;
        }
        const allProductsData: Product[] = await allProductsRes.json();
        // Фильтруем, чтобы исключить текущий товар и оставить 3 случайных
        const related = allProductsData
            .filter(p => p.id !== productData.id && p.category === productData.category)
            .slice(0, 3);
        setRelatedProducts(related);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [productId]); // Эффект перезапустится, если ID в URL изменится

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // 4. Рендеринг состояний загрузки и ошибок
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex justify-center items-center">
        <Loader className="w-16 h-16 text-[#C17B5C] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex justify-center items-center text-center">
        <div>
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#2C2416] mb-2 font-serif">Ошибка</h1>
          <p className="text-[#6B5D4F] font-sans mb-6">{error}</p>
          <Link href="/catalog" className="px-6 py-2 bg-[#C17B5C] text-white rounded-lg font-semibold hover:bg-[#A66A4D]">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  // Если товар не найден после загрузки (на всякий случай)
  if (!product) {
    return null; // или можно вернуть компонент "Не найдено"
  }

  // 5. Основной рендеринг страницы с полученными данными
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="relative aspect-square bg-white border-2 border-[#E8DCC8] rounded-xl overflow-hidden group">
                <img
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#C17B5C] text-[#FAF7F2] text-sm font-bold rounded-full font-sans">
                    -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                  </span>
                )}
                {product.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                      <ChevronLeft className="w-6 h-6 text-[#2C2416]" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
                      <ChevronRight className="w-6 h-6 text-[#2C2416]" />
                    </button>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImage === index
                          ? "border-[#C17B5C] ring-2 ring-[#C17B5C]/30"
                          : "border-[#E8DCC8] hover:border-[#C17B5C]/50"
                      }`}
                    >
                      <img src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#2C2416] font-serif">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-[#C17B5C] font-serif">
                  {product.price.toLocaleString("ru-RU")} ₽
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-2xl text-[#6B5D4F] line-through font-serif">
                    {product.oldPrice.toLocaleString("ru-RU")} ₽
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-semibold font-sans">В наличии</span>
                  </>
                ) : (
                  <span className="text-red-600 font-semibold font-sans">Нет в наличии</span>
                )}
              </div>
              <p className="text-lg text-[#6B5D4F] leading-relaxed font-sans">{product.description}</p>
              <div className="pt-4">
                <Link href="/contact" passHref>
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#C17B5C] text-[#FAF7F2] rounded-lg font-bold text-lg hover:bg-[#A66A4D] transition-all active:scale-95 font-sans">
                    <Send className="w-5 h-5" />
                    Связаться с нами
                  </button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8DCC8]">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8DCC8] rounded-lg"><Truck className="w-5 h-5 text-[#C17B5C]" /></div>
                  <div>
                    <div className="font-semibold text-[#2C2416] font-sans">Доставка</div>
                    <div className="text-sm text-[#6B5D4F] font-sans">2-5 дней</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8DCC8] rounded-lg"><Shield className="w-5 h-5 text-[#C17B5C]" /></div>
                  <div>
                    <div className="font-semibold text-[#2C2416] font-sans">Гарантия</div>
                    <div className="text-sm text-[#6B5D4F] font-sans">{product.specifications.warranty}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#E8DCC8] rounded-lg"><RotateCcw className="w-5 h-5 text-[#C17B5C]" /></div>
                  <div>
                    <div className="font-semibold text-[#2C2416] font-sans">Возврат</div>
                    <div className="text-sm text-[#6B5D4F] font-sans">14 дней</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 lg:mt-16">
            <div className="bg-white border-2 border-[#E8DCC8] rounded-xl p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#2C2416] mb-4 font-serif">Характеристики</h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#C17B5C] flex-shrink-0 mt-0.5" />
                        <span className="text-[#6B5D4F] font-sans">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#2C2416] mb-4 font-serif">Спецификации</h2>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-[#E8DCC8]">
                        <span className="text-[#6B5D4F] font-sans capitalize">{key}:</span>
                        <span className="font-semibold text-[#2C2416] font-sans">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-[#FAF7F2] to-[#E8DCC8]/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C2416] mb-8 text-center font-serif">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/catalog/${relatedProduct.id}`}>
                  <div className="group bg-white border-2 border-[#E8DCC8] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-[#E8DCC8]/20">
                      <img src={relatedProduct.images[0] || "/placeholder.svg"} alt={relatedProduct.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-[#2C2416] line-clamp-2 font-serif">{relatedProduct.name}</h3>
                      <span className="text-2xl font-bold text-[#C17B5C] font-serif mt-4 block">{relatedProduct.price.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}