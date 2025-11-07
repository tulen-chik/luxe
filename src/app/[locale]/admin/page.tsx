
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader, AlertCircle } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import ProductList from "@/components/admin/ProductList";
import { Product } from "@/types/data";


export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для управления формой
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Функция для загрузки продуктов
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Не удалось загрузить товары");
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем продукты при монтировании компонента
  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Обработчики CRUD ---

  const handleCreateNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот товар?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Не удалось удалить товар");
      // Обновляем список товаров после удаления
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при сохранении товара");
      }
      // После успешного сохранения закрываем форму и обновляем список
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-serif">
            Панель управления товарами
          </h1>
          {!showForm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-[#C17B5C] text-white rounded-lg font-semibold shadow-md"
            >
              <Plus size={20} />
              Добавить товар
            </motion.button>
          )}
        </header>

        <div>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ProductForm
                initialData={editingProduct}
                onSubmit={handleFormSubmit}
                onCancel={handleCancelForm}
              />
            </motion.div>
          )}
        </div>

        <main className="mt-8">
          {isLoading && (
            <div className="flex justify-center items-center p-16">
              <Loader className="animate-spin text-[#C17B5C]" size={48} />
            </div>
          )}
          {error && (
            <div className="flex justify-center items-center gap-2 p-4 bg-red-100 text-red-700 rounded-lg">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && !showForm && (
            <ProductList
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
    </div>
  );
}