"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/AuthProvider";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/actions/admin/products/delete";
import { addPriceToCart, getCartCount, onCartChange } from "@/lib/cart";
import { Plus } from "lucide-react";

type Product = {
  id: string;
  title: string;
  serialNumber: string;
  stock: number;
  price?: { amount: number; currency: "EUR" };
  imageUrls?: string[];
  stripePriceId?: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<Record<string, number>>({});
  const [cartCount, setCartCount] = useState(0);

  const { user, loading, isAdmin } = useAuth();
  const uid = user?.uid;

  useEffect(() => {
    const update = () => setCartCount(getCartCount(uid));
    update();
    return onCartChange(update);
  }, [uid]);

  async function load() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return null;

  function nextImage(
    productId: string,
    images: string[],
    dir: "next" | "prev",
  ) {
    if (images.length < 2) return;

    setActiveImage((prev) => {
      const current = prev[productId] ?? 0;
      const total = images.length;
      const nextIndex =
        dir === "next" ? (current + 1) % total : (current - 1 + total) % total;

      return { ...prev, [productId]: nextIndex };
    });
  }

  return (
    <div className="w-full space-y-10">
      <section className="mx-4 relative h-72 md:h-96 overflow-hidden rounded-2xl">
        <img
          src="/hero.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/35" />

        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-10 max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-white/70 pb-2">
            Premium • Shopping • Experience
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">
            Discover products you&apos;ll love
          </h1>
          <p className="mt-3 text-white/80 text-sm md:text-base">
            Smooth shopping experience.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-200/40 dark:bg-neutral-900/40 backdrop-blur p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-black/90 dark:text-white">
            Product List
          </h2>

          {user ? (
            <p className="text-sm text-black/60 dark:text-white/60">
              Cart: {cartCount}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {products.map((p) => {
            const images = Array.isArray(p.imageUrls) ? p.imageUrls : [];
            const idx = activeImage[p.id] ?? 0;
            const img = images[idx] ?? "";
            const confirming = confirmId === p.id;

            return (
              <div
                key={p.id}
                className="relative w-full max-w-sm mx-auto rounded-xl border border-black/10 dark:border-white/10 bg-neutral-100/70 dark:bg-neutral-800/70 p-4 shadow-sm transition hover:shadow-md flex flex-col"
              >
                <p className="font-semibold mb-3 text-black/90 dark:text-white">
                  {p.title}
                </p>

                {user && (
                  <Button
                    size="icon"
                    variant="secondary"
                    disabled={!p.stripePriceId}
                    className="absolute top-3 right-3 z-10 shadow-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95"
                    onClick={() => {
                      if (!p.stripePriceId) return;
                      addPriceToCart(p.stripePriceId, uid);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}

                {img ? (
                  <div className="relative mb-3 rounded-lg bg-white/70 dark:bg-black/20 p-3">
                    <img
                      src={img}
                      alt={p.title}
                      className="h-44 w-full object-contain"
                    />

                    {images.length > 1 && (
                      <div className="absolute bottom-2 right-2 text-[11px] px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur">
                        {idx + 1}/{images.length}
                      </div>
                    )}

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => nextImage(p.id, images, "prev")}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur hover:bg-black/60 active:scale-95"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          onClick={() => nextImage(p.id, images, "next")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur hover:bg-black/60 active:scale-95"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="mb-3 h-44 w-full rounded-lg bg-neutral-300 dark:bg-neutral-800" />
                )}

                <div className="rounded-md border border-neutral-200 dark:border-neutral-600 p-3 text-sm space-y-1">
                  <p>
                    Serial:{" "}
                    <span className="font-medium">{p.serialNumber}</span>
                  </p>
                  <p>
                    Price:{" "}
                    <span className="font-medium">
                      {p.price?.amount ?? "-"} {p.price?.currency ?? ""}
                    </span>
                  </p>
                  <p>
                    Stock: <span className="font-medium">{p.stock ?? "-"}</span>
                  </p>
                </div>

                {isAdmin && (
                  <div className="mt-auto pt-4 flex justify-end gap-2">
                    {confirming ? (
                      <>
                        <Button
                          variant="secondary"
                          onClick={() => setConfirmId(null)}
                          disabled={busyId === p.id}
                        >
                          Cancel
                        </Button>

                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={busyId === p.id}
                          onClick={async () => {
                            try {
                              setBusyId(p.id);
                              await deleteProduct(p.id);
                              setProducts((prev) =>
                                prev.filter((x) => x.id !== p.id),
                              );
                              setConfirmId(null);
                            } finally {
                              setBusyId(null);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          asChild
                          className="bg-neutral-100 text-black hover:bg-white
dark:bg-neutral-300 dark:text-black dark:hover:bg-neutral-400"
                        >
                          <Link href={`/admin/products/${p.id}`}>Edit</Link>
                        </Button>

                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => setConfirmId(p.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!products.length && (
          <p className="text-sm opacity-70 mt-6 text-center">
            No products yet.
          </p>
        )}
      </section>
    </div>
  );
}
