import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const pricesRaw = formData.get("prices");
    const cartRaw = formData.get("cart");
    const userIdRaw = formData.get("userId");

    if (!pricesRaw || typeof pricesRaw !== "string") {
      return NextResponse.json({ error: "Missing prices" }, { status: 400 });
    }

    if (!cartRaw || typeof cartRaw !== "string") {
      return NextResponse.json({ error: "Missing cart" }, { status: 400 });
    }

    const userId = typeof userIdRaw === "string" ? userIdRaw : "guest";

    const prices = pricesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (prices.length === 0) {
      return NextResponse.json(
        { error: "No prices provided" },
        { status: 400 }
      );
    }

    const lineItems: { price: string; quantity: number }[] = [];

    for (const priceId of prices) {
      const existing = lineItems.find((x) => x.price === priceId);

      if (existing) {
        existing.quantity += 1;
      } else {
        lineItems.push({ price: priceId, quantity: 1 });
      }
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
        userId: userId && userId.length > 0 ? userId : "guest",
        cart: cartRaw,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Session URL is null" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: err?.statusCode || 500 }
    );
  }
}
