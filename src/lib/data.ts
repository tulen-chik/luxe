import path from "path";
import { promises as fs } from "fs";
import { Product } from "@/types/data"; // Убедитесь, что путь к вашему файлу с типами верный

// Путь к файлу с данными
const jsonFilePath = path.join(process.cwd(), "public", "products.json");
const uploadsDir = path.join(process.cwd(), "public", "uploads");

/**
 * Читает все продукты из JSON файла.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const fileContents = await fs.readFile(jsonFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Could not read products.json:", error);
    return [];
  }
}

/**
 * Находит продукт по его ID.
 */
export async function getProductById(id: string | number): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.id === Number(id));
}

/**
 * Сохраняет массив продуктов обратно в JSON файл.
 */
async function saveProducts(products: Product[]) {
  await fs.writeFile(jsonFilePath, JSON.stringify(products, null, 2));
}

/**
 * Сохраняет загруженный файл на диск.
 */
async function saveFile(file: File): Promise<string> {
    try {
        await fs.access(uploadsDir);
    } catch (error) {
        await fs.mkdir(uploadsDir, { recursive: true });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const imagePath = path.join(uploadsDir, filename);
    await fs.writeFile(imagePath, buffer);
    return `/uploads/${filename}`;
}

/**
 * Удаляет файл с диска.
 */
async function deleteFile(publicPath: string) {
    try {
        const filePath = path.join(process.cwd(), "public", publicPath);
        await fs.unlink(filePath);
    } catch (error) {
        console.error(`Failed to delete file: ${publicPath}`, error);
    }
}

/**
 * Создает новый продукт.
 */
export async function createProduct(formData: FormData): Promise<Product> {
  const products = await getAllProducts();
  const newProduct: any = {
    id: Date.now(),
    images: [],
    features: formData.getAll("features"),
    specifications: {},
  };

  formData.forEach((value, key) => {
    if (key.startsWith("specifications.")) {
      // ИСПРАВЛЕНИЕ: Уточняем тип ключа
      const specKey = key.split(".")[1] as keyof Product['specifications'];
      newProduct.specifications[specKey] = value;
    } else if (key !== "features" && !(value instanceof File)) {
      newProduct[key] = value;
    }
  });

  const imageFiles = formData.getAll("images") as File[];
  for (const file of imageFiles) {
    if (file && file.size > 0) {
      const newPath = await saveFile(file);
      newProduct.images.push(newPath);
    }
  }
  
  newProduct.price = Number(newProduct.price);
  newProduct.oldPrice = newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined;
  newProduct.inStock = newProduct.inStock === 'true';

  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

/**
 * Обновляет существующий продукт.
 */
export async function updateProduct(id: string, formData: FormData): Promise<Product | null> {
    const products = await getAllProducts();
    const productIndex = products.findIndex((p) => p.id === Number(id));

    if (productIndex === -1) return null;

    const updatedProduct = { ...products[productIndex] };

    formData.forEach((value, key) => {
        if (key.startsWith("specifications.")) {
            // ИСПРАВЛЕНИЕ: Уточняем тип ключа
            const specKey = key.split(".")[1] as keyof Product['specifications'];
            updatedProduct.specifications[specKey] = value as string;
        } else if (key === "features") {
            updatedProduct.features = formData.getAll('features') as string[];
        } else if (key !== "images" && !(value instanceof File)) {
            (updatedProduct as any)[key] = value;
        }
    });

    const newImageFiles = formData.getAll("images").filter(f => (f as File).size > 0) as File[];
    if (newImageFiles.length > 0) {
        for (const imageUrl of updatedProduct.images || []) {
            await deleteFile(imageUrl);
        }
        updatedProduct.images = [];
        for (const file of newImageFiles) {
            const newPath = await saveFile(file);
            updatedProduct.images.push(newPath);
        }
    }

    updatedProduct.price = Number((updatedProduct as any).price);
    updatedProduct.oldPrice = (updatedProduct as any).oldPrice ? Number((updatedProduct as any).oldPrice) : undefined;
    updatedProduct.inStock = (updatedProduct as any).inStock === 'true';

    products[productIndex] = updatedProduct;
    await saveProducts(products);
    return updatedProduct;
}

/**
 * Удаляет продукт.
 */
export async function deleteProduct(id: string): Promise<boolean> {
    let products = await getAllProducts();
    const productToDelete = products.find((p) => p.id === Number(id));

    if (!productToDelete) return false;

    if (productToDelete.images && productToDelete.images.length > 0) {
        for (const imageUrl of productToDelete.images) {
            await deleteFile(imageUrl);
        }
    }

    products = products.filter((p) => p.id !== Number(id));
    await saveProducts(products);
    return true;
}