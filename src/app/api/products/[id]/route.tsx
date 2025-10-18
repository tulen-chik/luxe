
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

const jsonFilePath = path.join(process.cwd(), "public", "products.json");

async function getProducts() {
  try {
    const fileContents = await fs.readFile(jsonFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

// GET: Получить один светильник по ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const products = await getProducts();
  const product = products.find((p: any) => p.id === Number(params.id));

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT: Обновить светильник по ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const products = await getProducts();
  const productIndex = products.findIndex((p: any) => p.id === Number(params.id));

  if (productIndex === -1) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const updatedProduct = { ...products[productIndex] };

  // Обрабатываем текстовые поля
  formData.forEach((value, key) => {
    if (key.startsWith("specifications.")) {
      const specKey = key.split(".")[1];
      updatedProduct.specifications[specKey] = value;
    } else if (key === "features") {
      updatedProduct.features = formData.getAll('features');
    } else if (key !== "images" && !(value instanceof File)) {
      updatedProduct[key] = value;
    }
  });

  // Обрабатываем изображения
  const newImageFiles = formData.getAll("images").filter(f => (f as File).size > 0) as File[];

  if (newImageFiles.length > 0) {
    // 1. Удаляем старые изображения с диска
    const oldImages = updatedProduct.images || [];
    for (const imageUrl of oldImages) {
      try {
        const imagePath = path.join(process.cwd(), "public", "uploads", imageUrl);
        await fs.unlink(imagePath);
      } catch (error) {
        console.error(`Не удалось удалить старое изображение: ${imageUrl}`, error);
      }
    }

    // 2. Сохраняем новые изображения и обновляем пути
    updatedProduct.images = []; // Очищаем массив
    for (const file of newImageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const imagePath = path.join("public", "uploads", filename);
      
      await fs.writeFile(imagePath, buffer);
      updatedProduct.images.push(`/uploads/${filename}`);
    }
  }

  // Преобразуем типы
  updatedProduct.price = Number(updatedProduct.price);
  updatedProduct.oldPrice = updatedProduct.oldPrice ? Number(updatedProduct.oldPrice) : undefined;
  updatedProduct.inStock = updatedProduct.inStock === 'true';

  products[productIndex] = updatedProduct;
  await fs.writeFile(jsonFilePath, JSON.stringify(products, null, 2));

  return NextResponse.json(updatedProduct);
}

// DELETE: Удалить светильник по ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  let products = await getProducts();
  const productToDelete = products.find((p: any) => p.id === Number(params.id));

  if (!productToDelete) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  // Удаляем связанные изображения
  if (productToDelete.images && productToDelete.images.length > 0) {
    for (const imageUrl of productToDelete.images) {
      try {
        const imagePath = path.join(process.cwd(), "public", "uploads", imageUrl);
        await fs.unlink(imagePath);
      } catch (error) {
        console.error(`Failed to delete image: ${imageUrl}`, error);
      }
    }
  }

  // Фильтруем массив, чтобы удалить товар
  products = products.filter((p: any) => p.id !== Number(params.id));
  await fs.writeFile(jsonFilePath, JSON.stringify(products, null, 2));

  return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
}