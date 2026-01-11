"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart";

export default function SuccessClient() {
  useEffect(() => {
    clearCart();
  }, []);

  return null;
}
