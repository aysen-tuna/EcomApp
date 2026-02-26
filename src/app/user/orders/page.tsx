"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import { listenUserOrders, type OrderDoc } from "@/lib/orders";

export default function UserOrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderDoc[]>([]);

  useEffect(() => {
    if (!user) return;
    return listenUserOrders(user.uid, setOrders);
  }, [user]);

  if (loading) return null;
  if (!user) return <p>Please login to see your orders.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-4 bg-neutral-100 dark:bg-neutral-900 rounded-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <p className="text-sm opacity-70">{orders.length} orders</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm opacity-70">No orders yet.</p>
      ) : (
        orders.map((o, i) => {
          const total = `€${((o.amountTotal ?? 0) / 100).toFixed(2)}`;

          const ms = o.createdAt?.toMillis?.();
          const date = ms ? new Date(ms).toLocaleString() : "-";

          const s = (o.status ?? "unknown").toLowerCase();
          const ok = s === "complete" || s === "completed" || s === "paid";
          const statusClass = ok
            ? "text-green-600 dark:text-green-400"
            : "text-neutral-600 dark:text-neutral-300";

          return (
            <div
              key={i}
              className="border p-4 rounded bg-white dark:bg-neutral-950 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-70">{date}</p>
                <p className={`text-sm font-semibold ${statusClass}`}>
                  {o.status ?? "unknown"}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm opacity-70">Total</p>
                <p className="text-lg font-semibold">{total}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}