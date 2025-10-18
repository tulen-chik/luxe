import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

// Определяем путь к нашему JSON файлу
const jsonFilePath = path.join(process.cwd(), "public", "products.json");

// Функция для чтения данных из файла
async function getProducts() {
  try {
    const fileContents = await fs.readFile(jsonFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    // Если файл не найден, возвращаем пустой массив
    return [];
  }
}

// GET: Получить все светильники
export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

// POST: Создать новый светильник
export async function POST(request: Request) {
  const products = await getProducts();
  const formData = await request.formData();

  const newProduct: any = {
    id: Date.now(),
    images: [], // Инициализируем пустой массив для картинок
    features: formData.getAll("features"), // Сразу получаем все features
    specifications: {},
  };

  // Обрабатываем текстовые поля
  formData.forEach((value, key) => {
    if (key.startsWith("specifications.")) {
      const specKey = key.split(".")[1];
      newProduct.specifications[specKey] = value;
    } else if (key !== "features" && !(value instanceof File)) {
      // Игнорируем features (уже обработаны) и файлы
      newProduct[key] = value;
    }
  });

  // Обрабатываем файлы изображений
  const imageFiles = formData.getAll("images") as File[];
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const imagePath = path.join("public", "uploads", filename);

        // 1. Определяем путь к папке для загрузок
        const uploadsDir = path.join(process.cwd(), "public", "uploads");

        // 2. Убеждаемся, что папка существует (создаем, если нет)
        try {
            await fs.access(uploadsDir);
        } catch (error) {
            await fs.mkdir(uploadsDir, { recursive: true });
        }
      
      await fs.writeFile(imagePath, buffer);
      newProduct.images.push(`/uploads/${filename}`);
    }
  }
  
  // Преобразуем типы
  newProduct.price = Number(newProduct.price);
  newProduct.oldPrice = newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined;
  newProduct.inStock = newProduct.inStock === 'true';

  products.push(newProduct);
  await fs.writeFile(jsonFilePath, JSON.stringify(products, null, 2));

  return NextResponse.json(newProduct, { status: 201 });
}