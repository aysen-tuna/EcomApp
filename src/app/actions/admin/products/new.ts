"use server";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { productSchema } from "@/lib/productSchema";
import { revalidatePath } from "next/cache";

export async function createProduct(uid: string, raw: unknown) {
  if (!uid) throw new Error("Missing uid");

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation error");
  }

  await addDoc(collection(db, "products"), {
    ...parsed.data,
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  revalidatePath("/");
  return { ok: true };
}
