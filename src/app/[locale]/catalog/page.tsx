import { AlertCircle } from "lucide-react";
import CatalogClient from "./catalog-client";
import { getAllProducts } from "@/lib/data";

export default async function CatalogPage() {
  try {
    const allProducts = await getAllProducts();

    return <CatalogClient allProducts={allProducts} />;

  } catch (error: any) {
    console.error("Failed to load products for Catalog Page:", error);
    
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center py-32">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#2C2416] mb-2 font-serif">Ошибка загрузки</h3>
          <p className="text-[#6B5D4F] font-sans">Не удалось загрузить список товаров.</p>
        </div>
      </div>
    );
  }
}