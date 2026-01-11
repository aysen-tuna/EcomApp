"use server";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { productSchema } from "@/lib/productSchema";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";

export async function createProduct(uid: string, raw: unknown) {
  if (!uid) throw new Error("Missing uid");

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation error");
  }

  const stripeProduct = await stripe.products.create({
    name: parsed.data.title,
    description: parsed.data.description || undefined,
    images: parsed.data.imageUrls?.slice(0, 8),
    metadata: {
      serialNumber: parsed.data.serialNumber,
      brand: parsed.data.brand ?? "",
      category: parsed.data.category ?? "",
    },
  });

  const stripePrice = await stripe.prices.create({
    product: stripeProduct.id,
    currency: "eur",
    unit_amount: Math.round(parsed.data.price.amount * 100),
  });

  await addDoc(collection(db, "products"), {
    ...parsed.data,
    stripeProductId: stripeProduct.id,
    stripePriceId: stripePrice.id,
    createdBy: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  revalidatePath("/");
  return { ok: true };
}
