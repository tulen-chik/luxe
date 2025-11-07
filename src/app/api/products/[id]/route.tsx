import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/data";
import { revalidatePath } from "next/cache";

// GET: Получить один светильник по ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

// PUT: Обновить светильник по ID
// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const formData = await request.formData();
//   const updatedProduct = await updateProduct(params.id, formData);

//   if (!updatedProduct) {
//     return NextResponse.json({ message: "Product not found" }, { status: 404 });
//   }

//   // РЕВАЛИДАЦИЯ: Обновляем страницу каталога и конкретного товара
//   revalidatePath('/[locale]/catalog', 'layout');
//   revalidatePath(`/[locale]/catalog/${params.id}`);

//   return NextResponse.json(updatedProduct);
// }

// DELETE: Удалить светильник по ID
// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   const success = await deleteProduct(params.id);

//   if (!success) {
//     return NextResponse.json({ message: "Product not found" }, { status: 404 });
//   }

//   // РЕВАЛИДАЦИЯ: Обновляем страницу каталога и удаляем страницу товара из кеша
//   revalidatePath('/[locale]/catalog', 'layout');
//   revalidatePath(`/[locale]/catalog/${params.id}`);

//   return NextResponse.json({ message: "Product deleted successfully" });
// }