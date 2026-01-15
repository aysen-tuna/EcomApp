"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart";
import { useAuth } from "@/app/AuthProvider";

export default function SuccessClient() {
    const { user } = useAuth();
  const uid = user?.uid;
  useEffect(() => {
  clearCart(user?.uid);
  }, [uid]);

  return null;
}
