"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/actions/admin/products/delete";

type Product = {
  id: string;
  title: string;
  serialNumber: string;
  stock: number;
  price?: { amount: number; currency: "EUR" };
  imageUrls?: string[];
};

export default function AdminProductsPage() {
  const { loading, isAdmin } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState<Record<string, number>>({});

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
    dir: "next" | "prev"
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
    <div className="w-full max-w-6xl bg-neutral-100 dark:bg-neutral-900 mx-auto mt-10 space-y-4 p-8 rounded-md">
      <h2 className="font-semibold">Product List</h2>

      <div
        className="grid gap-4 justify-center 
                grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
      >
        {products.map((p) => {
          const images = Array.isArray(p.imageUrls) ? p.imageUrls : [];
          const idx = activeImage[p.id] ?? 0;
          const img = images[idx] ?? "";
          const confirming = confirmId === p.id;

          return (
            <div
              key={p.id}
              className="w-full max-w-sm rounded-md border bg-neutral-200 dark:bg-neutral-800 p-4 mx-auto"
            >
              <p className="font-semibold mb-8">{p.title}</p>

              {img ? (
                <div className="relative mb-3 bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={img}
                    alt={p.title}
                    className="h-40 w-full object-contain rounded"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => nextImage(p.id, images, "prev")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 
                     bg-black/50 text-white rounded-full w-7 h-7
                     flex items-center justify-center"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        onClick={() => nextImage(p.id, images, "next")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 
                     bg-black/50 text-white rounded-full w-7 h-7
                     flex items-center justify-center"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className=" h-40 w-full rounded mb-2 bg-neutral-300 dark:bg-neutral-800" />
              )}
              <div className="rounded-md border border-neutral-100 dark:border-neutral-600 p-2">
                <div className="text-sm space-y-1 mt-2">
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
                  {images.length > 1 ? (
                    <p className="opacity-70">
                      Image {idx + 1}/{images.length}
                    </p>
                  ) : null}
                </div>

                {isAdmin ? (
                  <div className="mt-4 flex justify-end gap-2">
                    {confirming ? (
                      <>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => setConfirmId(null)}
                          disabled={busyId === p.id}
                        >
                          Cancel
                        </Button>

                        <Button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          disabled={busyId === p.id}
                          onClick={async () => {
                            try {
                              setBusyId(p.id);
                              await deleteProduct(p.id);
                              setConfirmId(null);
                              await load();
                            } finally {
                              setBusyId(null);
                            }
                          }}
                        >
                          {busyId === p.id ? "Deleting..." : "Delete"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          asChild
                          className="bg-neutral-100 text-black hover:bg-white
             dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300"
                        >
                          <Link href={`/admin/products/${p.id}`}>Edit</Link>
                        </Button>

                        <Button
                          type="button"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => setConfirmId(p.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {!products.length ? (
        <p className="text-sm opacity-70 mt-6 text-center">No products yet.</p>
      ) : null}
    </div>
  );
}
