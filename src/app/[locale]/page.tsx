import HomeClient from "@/components/home-client"; // Убедитесь, что путь правильный
import type { Product } from "@/components/home-client";

// Функция для получения популярных товаров
async function getPopularProducts(): Promise<Product[]> {
  try {
    // Используем абсолютный URL для fetch на сервере
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=3`, {
      // Эта опция кэширует результат и перепроверяет его (регенерирует страницу)
      // не чаще, чем раз в час (3600 секунд). Идеально для главной страницы.
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("Не удалось загрузить популярные товары. Сервер вернул ошибку.");
      return []; // Возвращаем пустой массив для graceful degradation
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при запросе популярных товаров:", error);
    return []; // В случае ошибки сети также возвращаем пустой массив
  }
}

export default async function HomePage() {
  // Получаем данные на сервере
  const popularProducts = await getPopularProducts();

  // Рендерим клиентский компонент, передавая ему данные как props
  return <HomeClient products={popularProducts.slice(0, 3)} />;
}