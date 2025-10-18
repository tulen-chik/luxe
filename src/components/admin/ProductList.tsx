import { Edit, Trash2 } from "lucide-react";

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
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductList({ products, onEdit, onDelete }: Props) {
  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-16">Товары не найдены. Нажмите "Добавить товар", чтобы создать первый.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товар</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img className="h-12 w-12 rounded-md object-cover" src={product.images[0] || '/placeholder.svg'} alt={product.name} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 capitalize">{product.category}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price.toLocaleString('ru-RU')} ₽</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4" title="Редактировать">
                  <Edit size={18} />
                </button>
                <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-900" title="Удалить">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}