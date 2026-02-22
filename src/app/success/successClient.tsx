"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearCart } from "@/lib/cart";
import { useAuth } from "@/app/AuthProvider";

export default function SuccessClient() {
  const router = useRouter();
   const { user } = useAuth();

  useEffect(() => {
       clearCart(user?.uid);
    const t = setTimeout(() => router.push("/user/orders"), 2500);
    return () => clearTimeout(t);
  }, [router, user?.uid]);

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 rounded border bg-neutral-100 dark:bg-neutral-900 text-center space-y-3">
      <h1 className="text-xl font-semibold">Payment successful</h1>

      <p className="text-sm opacity-80">
        Your order is created. Redirecting to <b>My Orders</b>...
      </p>

      <button
        onClick={() => router.push("/user/orders")}
        className="px-4 py-2 rounded border text-sm"
      >
        Go now
      </button>
    </div>
  );
}