import HomeClient from "@/components/home-client"; // Убедитесь, что путь правильный
import type { Product } from "@/components/home-client";
import { getAllProducts } from "@/lib/data";

export default async function HomePage() {
  // Получаем данные на сервере
  const popularProducts = await getAllProducts();

  // Рендерим клиентский компонент, передавая ему данные как props
  return <HomeClient products={popularProducts.slice(0, 3)} />;
}