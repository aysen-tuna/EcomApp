"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/AuthProvider";
import { listenUserOrders, type OrderDoc } from "@/lib/orders";

export default function UserOrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderDoc[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    return listenUserOrders(user.uid, setOrders);
  }, [user]);

  if (loading) return null;
  if (!user) return <p>Please login to see your orders.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 space-y-4 bg-neutral-100 dark:bg-neutral-900 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Orders</h2>
        <p className="text-sm opacity-70">{orders.length} orders</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm opacity-70">No orders yet.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => {
            const total = `€${((o.amountTotal ?? 0) / 100).toFixed(2)}`;

            const ms = o.createdAt?.toMillis?.();
            const date = ms ? new Date(ms).toLocaleString() : "-";

            const s = (o.status ?? "unknown").toLowerCase();
            const ok = s === "complete" || s === "completed" || s === "paid";
            const statusClass = ok
              ? "bg-green-500/10 text-green-700 dark:text-green-400"
              : "bg-neutral-500/10 text-neutral-700 dark:text-neutral-300";

            const isOpen = openId === o.id;
            const items = o.items ?? [];

            return (
              <div
                key={o.id}
                className="
  border border-neutral-200 dark:border-neutral-800
  rounded-2xl
  bg-white dark:bg-neutral-950
  shadow-sm hover:shadow-md
  transition
"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : o.id)}
                  className="
    w-full text-left px-4 py-3
    hover:bg-black/5 dark:hover:bg-white/5
    transition
  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs opacity-60">{date}</p>
                      <p className="mt-0.5 text-base font-semibold">{total}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`
          text-xs font-semibold px-2 py-0.5 rounded-full
          ${statusClass}
        `}
                      >
                        {o.status ?? "unknown"}
                      </span>

                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isOpen ? "Hide details" : "View details"}
                      </span>
                    </div>
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t p-4 bg-neutral-50 dark:bg-neutral-900/30">
                    {items.length === 0 ? (
                      <p className="text-sm opacity-70">
                        No item details saved for this order.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {items.map((it, idx) => {
                          const unit = (it.unitAmount ?? 0) / 100;
                          const line = unit * (it.qty ?? 0);

                          return (
                            <div
                              key={`${o.id}-${idx}`}
                              className="flex justify-between gap-3 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold truncate">
                                  {it.title}
                                </p>
                                <p className="text-sm opacity-70">
                                  Qty:{" "}
                                  <span className="font-medium">{it.qty}</span>{" "}
                                  • Unit price:{" "}
                                  <span className="font-medium">
                                    €{unit.toFixed(2)}
                                  </span>
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-xs opacity-60">Total</p>
                                <p className="font-semibold">
                                  €{line.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
