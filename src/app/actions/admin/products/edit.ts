"use server";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { del } from "@vercel/blob";
import { productSchema } from "@/lib/productSchema";
import { revalidatePath } from "next/cache";

export async function editProduct(productId: string, raw: unknown) {
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation error");
  }

  const ref = doc(db, "products", productId);

  const prevSnap = await getDoc(ref);
  if (prevSnap.exists()) {
    const prev = prevSnap.data() as any;
    const prevUrls: string[] = Array.isArray(prev?.imageUrls)
      ? prev.imageUrls
      : [];
    const nextUrls: string[] = Array.isArray((parsed.data as any)?.imageUrls)
      ? (parsed.data as any).imageUrls
      : [];

    const removedUrls = prevUrls.filter((u) => !nextUrls.includes(u));
    if (removedUrls.length) {
      try {
        await del(removedUrls);
      } catch {}
    }
  }

  await setDoc(
    doc(db, "products", productId),
    { ...parsed.data, updatedAt: serverTimestamp() },
    { merge: true }
  );

  revalidatePath("/");
  return { ok: true };
}
