// lib/products.ts
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type ProductInput = {
  title: string;
  description: string;
  brand: string;
  serialNumber: string;
  category: string;
  price: {
    amount: number;
    currency: "EUR";
  };
  taxRate: number; 
  image: string;
  stock: number;
  draft: boolean;
  discount?: {
    rate: number;
  };
  createdBy: string;
};

export async function createProduct(product: ProductInput) {
  if (!product.title.trim()) throw new Error("Title required");
  if (product.price.amount < 0) throw new Error("Price must be positive");

  await addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}