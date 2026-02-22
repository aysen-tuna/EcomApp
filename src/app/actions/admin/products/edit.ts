"use server";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { del } from "@vercel/blob";
import { productSchema } from "@/lib/productSchema";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";

export async function editProduct(
  uid: string,
  productId: string,
  raw: unknown,
) {
  if (!uid) throw new Error("Missing uid");
  if (!productId) throw new Error("Missing productId");

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Validation error");
  }

  const ref = doc(db, "products", productId);

  const prevSnap = await getDoc(ref);
  if (!prevSnap.exists()) throw new Error("Product not found");

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

  const stripeProductId = prev?.stripeProductId;
  const prevStripePriceId = prev?.stripePriceId;

  if (!stripeProductId || !prevStripePriceId) {
    throw new Error("Missing Stripe IDs on product");
  }

  await stripe.products.update(stripeProductId, {
    name: parsed.data.title,
    description: parsed.data.description || undefined,
    images: parsed.data.imageUrls?.slice(0, 8),
    metadata: {
      serialNumber: parsed.data.serialNumber,
      brand: parsed.data.brand ?? "",
      category: parsed.data.category ?? "",
    },
  });

  const prevAmount = Number(prev?.price?.amount ?? 0);
  const newAmount = parsed.data.price.amount;

  let stripePriceId = prevStripePriceId;

  if (prevAmount !== newAmount) {
    const newPrice = await stripe.prices.create({
      product: stripeProductId,
      currency: "eur",
      unit_amount: Math.round(newAmount * 100),
    });
    stripePriceId = newPrice.id;
  }

  await setDoc(
    ref,
    {
      ...parsed.data,
      stripeProductId,
      stripePriceId,
      createdBy: prev?.createdBy ?? uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  revalidatePath("/");
  return { ok: true };
}
