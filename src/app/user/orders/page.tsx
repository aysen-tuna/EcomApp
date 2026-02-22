"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import { listenUserOrders, type OrderDoc } from "@/lib/orders";

export default function UserOrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderDoc[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenUserOrders(user.uid, setOrders);

    return unsubscribe;
  }, [user]);

  if (loading) return null;
  if (!user) return <p>Please login to see your orders.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h2 className="text-xl font-semibold">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((o, i) => (
          <div
            key={i}
            className="border p-4 rounded bg-neutral-100 dark:bg-neutral-900"
          >
            <p>
              Status: <b>{o.status}</b>
            </p>
            <p>Total: €{(((o.amountTotal ?? 0) as number) / 100).toFixed(2)}</p>
          </div>
        ))
      )}
    </div>
  );
}
