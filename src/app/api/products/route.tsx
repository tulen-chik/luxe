import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/data";
import { revalidatePath } from "next/cache";

// GET: Получить все светильники
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

// POST: Создать новый светильник
// export async function POST(request: Request) {
//   const formData = await request.formData();
//   const newProduct = await createProduct(formData);

//   // РЕВАЛИДАЦИЯ: Говорим Next.js пересобрать страницу каталога
//   revalidatePath('/[locale]/catalog', 'layout'); // Обновляем главную страницу каталога

//   return NextResponse.json(newProduct, { status: 201 });
// }