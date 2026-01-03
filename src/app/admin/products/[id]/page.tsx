"use client";

import { useParams } from "next/navigation";
import { ProductAddEdit } from "@/components/ProductAddEdit";

export default function AdminEditPage() {
  const { id } = useParams<{ id: string }>();
  return <ProductAddEdit mode="edit" productId={id} />;
}
