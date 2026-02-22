"use server";

import { del } from "@vercel/blob";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  const ref = doc(db, "products", productId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { ok: true };

  const data = snap.data() as any;
  const imageUrls: string[] = Array.isArray(data?.imageUrls)
    ? data.imageUrls
    : [];

  if (imageUrls.length) {
    await del(imageUrls);
  }

  await deleteDoc(ref);

  revalidatePath("/");
  return { ok: true };
}
