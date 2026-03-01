"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; 
import ProductCard from "@/components/ProductCard"; 
import { useAuth } from "@/app/AuthProvider";
import { db } from "@/lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { getCartCount, onCartChange } from "@/lib/cart";
import { ProductCategory } from "@/lib/productCategories";

type Product = {
  id: string;
  title: string;
  description?: string;
  brand?: string;
  category?: string;
  serialNumber: string;
  stock: number;
  price?: { amount: number; currency: "EUR" };
  imageUrls?: string[];
  stripePriceId?: string;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { user, loading, isAdmin } = useAuth();
  const uid = user?.uid;

  const categories = ["All", ...ProductCategory];
  const filteredProducts = selectedCategory === "All" ? products : products.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    const update = () => setCartCount(getCartCount(uid));
    update();
    return onCartChange(update);
  }, [uid]);

  useEffect(() => {
    async function load() {
      const snap = await getDocs(collection(db, "products"));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    }
    load();
  }, []);

  if (loading) return null;

  return (
    <div className="w-full min-w-[360px] space-y-10 pb-20">
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="/hero.webp"
          alt="Premium Shopping Experience"
          fill
          priority
          sizes="100vw"
          className="object-cover absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-black/10 dark:bg-black/35" />

        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-10 max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-white/70 pb-2">Premium • Shopping • Experience</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-white">Discover products you&apos;ll love</h1>
          <p className="mt-3 text-white/80 text-sm md:text-base">Smooth shopping experience.</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-14">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm sm:text-base md:text-lg transition tracking-wide ${
                  selectedCategory === cat
                    ? "font-semibold text-black dark:text-white underline underline-offset-8"
                    : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center max-w-screen-2xl mx-auto mt-6 px-2 md:px-3">
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              user={user}
              uid={uid}
              isAdmin={isAdmin}
              onDeleteSuccess={(deletedId: string) => {
                setProducts((prev) => prev.filter((x) => x.id !== deletedId));
              }}
            />
          ))}
        </div>
      </div>
      {!products.length && (
        <p className="text-sm opacity-70 mt-6 text-center">No products yet.</p>
      )}
    </div>
  );
}