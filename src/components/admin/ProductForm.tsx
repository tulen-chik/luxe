"use client";
import { Plus, Trash2, UploadCloud } from "lucide-react";

import { useState } from "react";
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

interface Props {
  initialData: Product | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSubmit, onCancel }: Props) {
  // --- Состояния для всех полей формы ---
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price || 0);
  const [oldPrice, setOldPrice] = useState(initialData?.oldPrice || 0);
  const [description, setDescription] = useState(initialData?.description || "");
  const [inStock, setInStock] = useState(initialData?.inStock ?? true);
  const [category, setCategory] = useState(initialData?.category || "pendant");
  const [specifications, setSpecifications] = useState(
    initialData?.specifications || {
      brand: "", collection: "", style: "", room: "", warranty: "", country: "",
    }
  );
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [newFeature, setNewFeature] = useState("");

  // --- Логика для изображений ---
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files || [])]);
    }
  };

  const handleRemoveNewFile = (indexToRemove: number) => {
    setNewFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };
  
  const handleRemoveExistingImage = (urlToRemove: string) => {
    setExistingImages((prevImages) => prevImages.filter((url) => url !== urlToRemove));
  };

  const handleSpecificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSpecifications((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() !== "") {
      setFeatures((prev) => [...prev, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (indexToRemove: number) => {
    setFeatures((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Добавляем все текстовые и числовые поля
    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("oldPrice", String(oldPrice));
    formData.append("description", description);
    formData.append("inStock", String(inStock));
    formData.append("category", category);
    features.forEach((feature) => formData.append("features", feature));
    Object.entries(specifications).forEach(([key, value]) => {
      formData.append(`specifications.${key}`, value);
    });

    // Добавляем изображения
    existingImages.forEach(url => formData.append("existingImages", url));
    newFiles.forEach(file => formData.append("images", file));

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 font-serif">
        {initialData ? "Редактировать товар" : "Создать новый товар"}
      </h2>

      {/* Секция: Основная информация */}
      <fieldset className="space-y-6 p-4 border rounded-md">
        <legend className="font-semibold text-lg px-2">Основная информация</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Название</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#C17B5C] focus:border-[#C17B5C]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Категория</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#C17B5C] focus:border-[#C17B5C]">
              <option value="pendant">Подвесные</option>
              <option value="floor">Торшеры</option>
              <option value="table">Настольные</option>
              <option value="chandelier">Люстры</option>
              <option value="wall">Настенные</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Цена (₽)</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#C17B5C] focus:border-[#C17B5C]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Старая цена (₽, необязательно)</label>
            <input type="number" value={oldPrice} onChange={(e) => setOldPrice(Number(e.target.value))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#C17B5C] focus:border-[#C17B5C]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Описание</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#C17B5C] focus:border-[#C17B5C]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Статус</label>
          <select value={String(inStock)} onChange={(e) => setInStock(e.target.value === 'true')} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#C17B5C] focus:border-[#C17B5C]">
            <option value="true">В наличии</option>
            <option value="false">Нет в наличии</option>
          </select>
        </div>
      </fieldset>

      {/* Секция: Характеристики (Features) */}
      <fieldset className="space-y-4 p-4 border rounded-md">
        <legend className="font-semibold text-lg px-2">Характеристики</legend>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm">{feature}</span>
              <button type="button" onClick={() => handleRemoveFeature(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Новая характеристика" className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-[#C17B5C] focus:border-[#C17B5C]" />
          <button type="button" onClick={handleAddFeature} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">
            <Plus size={16} />
          </button>
        </div>
      </fieldset>

      {/* Секция: Спецификации */}
      <fieldset className="space-y-6 p-4 border rounded-md">
        <legend className="font-semibold text-lg px-2">Спецификации</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(specifications).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
              <input type="text" name={key} value={specifications[key as keyof typeof specifications]} onChange={handleSpecificationChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#C17B5C] focus:border-[#C17B5C]" />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Секция: Изображения */}
      <fieldset className="space-y-4 p-4 border rounded-md">
        <legend className="font-semibold text-lg px-2">Изображения</legend>
        <div>
          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#C17B5C] hover:text-[#A66A4D] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#C17B5C]">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C17B5C]">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <span className="mt-2 block text-sm font-semibold text-gray-900">Нажмите, чтобы добавить файлы</span>
              <span className="block text-xs text-gray-500">Можно выбрать несколько</span>
            </div>
            <input id="file-upload" name="images" type="file" multiple onChange={handleFileChange} className="sr-only" />
          </label>
        </div>
        {(existingImages.length > 0 || newFiles.length > 0) && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img src={url} alt="Current" className="h-24 w-full object-cover rounded-md border" />
                <button type="button" onClick={() => handleRemoveExistingImage(url)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {newFiles.map((file, index) => (
              <div key={`new-${index}`} className="relative group">
                <img src={URL.createObjectURL(file)} alt="Preview" className="h-24 w-full object-cover rounded-md border" />
                <button type="button" onClick={() => handleRemoveNewFile(index)} className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Кнопки управления */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button type="button" onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
          Отмена
        </button>
        <button type="submit" className="px-6 py-2 bg-[#C17B5C] text-white rounded-lg hover:bg-[#A66A4D] font-semibold">
          {initialData ? "Сохранить изменения" : "Создать товар"}
        </button>
      </div>
    </form>
  );
}