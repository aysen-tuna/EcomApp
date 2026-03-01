"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/actions/admin/products/delete";
import { addPriceToCart, getCartQty } from "@/lib/cart";
import { Plus } from "lucide-react";


function getStockStatus(stock: number = 0) {
  if (stock <= 0) return { label: "No stock", className: "bg-red-600/15 text-red-700 dark:text-red-300" };
  if (stock < 5) return { label: "Low stock", className: "bg-amber-500/15 text-amber-700 dark:text-amber-300" };
  return { label: "In stock", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" };
}

export default function ProductCard({ p, user, uid, isAdmin, onDeleteSuccess }: any) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const images = Array.isArray(p.imageUrls) ? p.imageUrls : [];
  const img = images[currentImgIdx] ?? "";
  const maxStock = Number(p.stock ?? 0);
  const currentQty = p.stripePriceId && user ? getCartQty(p.stripePriceId, uid) : 0;
  const canAddToCart = Boolean(p.stripePriceId) && maxStock > 0 && currentQty < maxStock;

  function nextImage(dir: "next" | "prev") {
    if (images.length < 2) return;
    setCurrentImgIdx((prev) => {
      const total = images.length;
      return dir === "next" ? (prev + 1) % total : (prev - 1 + total) % total;
    });
  }

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-none rounded-xl border border-black/10 dark:border-white/10 bg-neutral-100/70 dark:bg-neutral-800/70 p-3 sm:p-4 shadow-sm transition hover:shadow-md flex flex-col">
      <p className="font-semibold mb-3 text-black/90 dark:text-white">{p.title}</p>

      {user && (
        <Button
          size="icon"
          variant="secondary"
          disabled={!canAddToCart}
          aria-label="Add to cart"
          title={!p.stripePriceId ? "No Stripe price" : maxStock <= 0 ? "Out of stock" : currentQty >= maxStock ? "Stock limit reached" : "Add to cart"}
          className="absolute top-3 right-3 z-10 shadow-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-900 active:text-white active:scale-90 dark:active:bg-neutral-100"
          onClick={() => { if (canAddToCart) addPriceToCart(p.stripePriceId, uid, maxStock); }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      )}

      {user && p.stripePriceId && <p className="text-xs opacity-70">In cart: {currentQty} / {maxStock}</p>}

      {img ? (
        <div className="relative mb-3 rounded-lg bg-white/70 dark:bg-black/20 p-3">
          <div className="relative h-44 w-full">
            <Image
              src={img}
              alt={p.title || "Product image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 text-[11px] px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur">
              {currentImgIdx + 1}/{images.length}
            </div>
          )}

          {images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image" 
                onClick={() => nextImage("prev")}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur hover:bg-black/60 active:scale-95"
              >‹</button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => nextImage("next")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur hover:bg-black/60 active:scale-95"
              >›</button>
            </>
          )}
        </div>
      ) : (
        <div className="mb-3 h-44 w-full rounded-lg bg-neutral-300 dark:bg-neutral-800" />
      )}

      <div className="rounded-md border border-neutral-200 dark:border-neutral-600 p-3 text-sm flex flex-col gap-1 min-h-[150px]">
        <p>Price: <span className="font-bold">{p.price?.amount ?? "-"} {p.price?.currency ?? ""}</span></p>
        <p>Category: <span className="font-bold">{p.category}</span></p>

        {isAdmin ? (
          <>
            <p>Serial: <span className="font-medium">{p.serialNumber ?? "-"}</span></p>
            <p>Stock: <span className="font-medium">{p.stock ?? "-"}</span></p>
            <p className="text-sm italic line-clamp-2 min-h-10">{p.description ?? ""}</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm">Availability:</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStockStatus(p.stock).className}`}>
                {getStockStatus(p.stock).label}
              </span>
            </div>
            <p className="text-sm italic line-clamp-2 min-h-10">{p.description ?? ""}</p>
          </>
        )}
      </div>

      {isAdmin && (
        <div className="mt-auto pt-4 flex justify-end gap-2">
          {confirming ? (
            <>
              <Button variant="secondary" onClick={() => setConfirming(false)} disabled={busy}>Cancel</Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={busy}
                onClick={async () => {
                  try {
                    setBusy(true);
                    await deleteProduct(p.id);
                    onDeleteSuccess(p.id);
                  } finally {
                    setBusy(false);
                  }
                }}
              >Delete</Button>
            </>
          ) : (
            <>
              <Button asChild className="bg-neutral-100 text-black hover:bg-white dark:bg-neutral-300 dark:text-black dark:hover:bg-neutral-400">
                <Link href={`/admin/products/${p.id}`}>Edit</Link>
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setConfirming(true)}>Delete</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}