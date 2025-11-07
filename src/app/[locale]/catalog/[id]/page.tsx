import { notFound } from 'next/navigation';
import ProductClient from './product-client';
import type { Product } from '@/types/data'; 
import { getAllProducts, getProductById } from '@/lib/data';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const allProducts = await getAllProducts();
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}