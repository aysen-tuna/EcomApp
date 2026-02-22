"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Button } from "@/components/ui/button";
import { addPriceToCart, getCartItems, removeOneFromCart } from "@/lib/cart";
import { useAuth } from "@/app/AuthProvider";
import type { CartItem } from "@/lib/cart";

type Product = {
  id: string;
  title: string;
  serialNumber: string;
  imageUrls?: string[];
  stripePriceId?: string;
  price?: { amount: number; currency: "EUR" };
};

type CartRow = {
  priceId: string;
  quantity: number;
  product?: Product;
};

type CartPayloadItem = {
  productId: string;
  qty: number;
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    }
    loadProducts();
  }, []);

  useEffect(() => {
    setCartItems(getCartItems(uid));
  }, [uid]);

  const cartRows: CartRow[] = cartItems.map((item) => ({
    priceId: item.priceId,
    quantity: item.qty,
    product: products.find((p) => p.stripePriceId === item.priceId),
  }));

  const totalCount = cartItems.reduce((s, x) => s + x.qty, 0);

  const grandTotal = (() => {
    let sum = 0;

    for (const row of cartRows) {
      const unit = row.product?.price?.amount ?? 0;
      sum += unit * row.quantity;
    }

    return sum;
  })();

  const cartPayload: CartPayloadItem[] = cartRows
    .map((row) => ({
      productId: row.product?.id ?? "",
      qty: row.quantity,
    }))
    .filter((x) => Boolean(x.productId) && x.qty > 0);

  function syncCart() {
    setCartItems(getCartItems(uid));
  }

  function handleMinus(priceId: string) {
    removeOneFromCart(priceId, uid);
    syncCart();
  }

  function handlePlus(priceId: string) {
    addPriceToCart(priceId, uid);
    syncCart();
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 p-6 bg-neutral-100 dark:bg-neutral-900 rounded-md space-y-6">
      <h1 className="text-xl font-semibold">Checkout</h1>

      <div className="flex items-center justify-between gap-6">
        <p className="text-sm opacity-70">
          Items in cart: <span className="font-semibold">{totalCount}</span>
        </p>

        <p className="text-sm opacity-70">
          Total in cart:{" "}
          <span className="font-semibold">€{grandTotal.toFixed(2)}</span>
        </p>

        <form
          action="/api/stripe/checkout"
          method="POST"
          onSubmit={() => setBusy(true)}
        >
          <input
            type="hidden"
            name="cart"
            value={JSON.stringify(cartPayload)}
          />

          <Button
            type="submit"
            disabled={totalCount < 1 || busy || cartPayload.length < 1}
          >
            {busy
              ? "Redirecting..."
              : `Pay with Stripe (€${grandTotal.toFixed(2)})`}
          </Button>
        </form>
      </div>

      {cartRows.length === 0 ? (
        <p className="text-sm opacity-70">Cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {cartRows.map((row) => {
            const p = row.product;
            const img = p?.imageUrls?.[0] ?? "";

            const unit = p?.price?.amount ?? 0;
            const lineTotal = unit * row.quantity;

            return (
              <div
                key={row.priceId}
                className="flex items-center gap-4 p-3 rounded-md border bg-neutral-200 dark:bg-neutral-800"
              >
                {img ? (
                  <img
                    src={img}
                    alt={p?.title ?? "product"}
                    className="w-20 h-20 object-contain rounded bg-neutral-50 dark:bg-neutral-900"
                  />
                ) : (
                  <div className="w-20 h-20 rounded bg-neutral-200 dark:bg-neutral-700" />
                )}

                <div className="flex-1">
                  <p className="font-semibold">
                    {p?.title ?? "Unknown product"}
                  </p>

                  <p className="text-sm opacity-70">
                    Serial:{" "}
                    <span className="font-medium">
                      {p?.serialNumber ?? "-"}
                    </span>
                  </p>

                  <p className="text-sm opacity-70">
                    Unit Price:{" "}
                    <span className="font-medium">€{unit.toFixed(2)}</span>
                  </p>

                  <p className="text-sm opacity-70">
                    Line Total:{" "}
                    <span className="font-medium">€{lineTotal.toFixed(2)}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={busy || row.quantity <= 0}
                    onClick={() => handleMinus(row.priceId)}
                    className="h-9 w-9 p-0"
                  >
                    −
                  </Button>

                  <span className="min-w-7 text-center font-semibold">
                    {row.quantity}
                  </span>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={busy}
                    onClick={() => handlePlus(row.priceId)}
                    className="h-9 w-9 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
