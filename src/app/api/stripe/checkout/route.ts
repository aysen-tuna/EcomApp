import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getUidFromSession } from "@/lib/firebase/getUidFromSession";

type CartItem = { productId: string; qty: number };

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const cartRaw = formData.get("cart");

    if (!cartRaw || typeof cartRaw !== "string") {
      return NextResponse.json({ error: "Missing cart" }, { status: 400 });
    }

    let cart: CartItem[] = [];
    try {
      cart = JSON.parse(cartRaw);
    } catch {
      return NextResponse.json({ error: "Invalid cart JSON" }, { status: 400 });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const userId = await getUidFromSession();

    const lineItems: { price: string; quantity: number }[] = [];

    for (const item of cart) {
      if (!item?.productId || typeof item.productId !== "string") continue;
      const qty = Number(item.qty) || 0;
      if (qty <= 0) continue;

      const snap = await getDoc(doc(db, "products", item.productId));
      if (!snap.exists()) continue;

      const priceId = (snap.data() as any)?.stripePriceId;
      if (!priceId || typeof priceId !== "string") continue;

      lineItems.push({ price: priceId, quantity: qty });
    }

    if (!lineItems.length) {
      return NextResponse.json({ error: "No valid items" }, { status: 400 });
    }
    const origin = request.headers.get("origin");

    if (!origin) {
      return NextResponse.json({ error: "Missing origin" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,

      metadata: {
        userId,
        cart: cartRaw,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Session URL is null" },
        { status: 500 },
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: err?.statusCode || 500 },
    );
  }
}
