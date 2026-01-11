"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthProvider";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

import { ProductForm, type ProductValues } from "@/components/ProductForm";
import { buildProductRaw } from "@/lib/productFormUtils";

type Props = { mode: "create" } | { mode: "edit"; productId: string };

const emptyValues: ProductValues = {
  title: "",
  description: "",
  brand: "",
  serialNumber: "",
  category: "",
  price: "",
  taxRate: "18",
  stock: "",
  draft: false,
  discountRate: "",
  imageUrls: [],
};

export function ProductAddEdit(props: Props) {
  const router = useRouter();
  const { loading, isAdmin, user } = useAuth();

  const [values, setValues] = useState<ProductValues>(emptyValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dataLoading, setDataLoading] = useState(props.mode === "edit");

  useEffect(() => {
    if (!loading && !isAdmin) router.replace("/");
  }, [loading, isAdmin, router]);

  useEffect(() => {
    async function run() {
      if (props.mode !== "edit") return;

      try {
        const snap = await getDoc(doc(db, "products", props.productId));
        if (!snap.exists()) {
          setError("Product not found");
          return;
        }

        const data = snap.data() as any;

        setValues({
          title: data?.title ?? "",
          description: data?.description ?? "",
          brand: data?.brand ?? "",
          serialNumber: data?.serialNumber ?? "",
          category: data?.category ?? "",
          price: String(data?.price?.amount ?? ""),
          taxRate: String(data?.taxRate ?? "18"),
          stock: String(data?.stock ?? ""),
          draft: Boolean(data?.draft),
          discountRate:
            data?.discount?.rate != null ? String(data.discount.rate) : "",
          imageUrls: Array.isArray(data?.imageUrls) ? data.imageUrls : [],
        });
      } finally {
        setDataLoading(false);
      }
    }

    run();
  }, [props]);

  async function onUploadImages(files: FileList | null) {
    if (!files?.length) return;

    setError("");
    setUploading(true);

    try {
      const form = new FormData();
      for (const f of Array.from(files)) form.append("files", f);

      const res = await fetch("/api/blob/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "Upload failed");

      const urls: string[] = Array.isArray(data?.urls) ? data.urls : [];
      setValues((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...urls],
      }));
    } catch (e: any) {
      setError(e?.message ?? "Upload error");
    } finally {
      setUploading(false);
    }
  }

  function onRemoveImage(url: string) {
    setValues((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((u) => u !== url),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!user?.uid) return;

    const raw = buildProductRaw(values);

    setSaving(true);
    try {
      if (props.mode === "create") {
        const { createProduct } = await import(
          "@/app/actions/admin/products/new"
        );
        await createProduct(user.uid, raw);
      } else {
        const { editProduct } = await import(
          "@/app/actions/admin/products/edit"
        );
        await editProduct(user.uid, props.productId, raw);
      }

      router.replace("/");
    } catch (e: any) {
      setError(e?.message ?? "Save error");
    } finally {
      setSaving(false);
    }
  }

  if (loading || dataLoading) return null;
  if (!isAdmin || !user?.uid) return null;

  return (
    <div className="w-full p-6 max-w-2xl mx-auto mt-8">
      <ProductForm
        mode={props.mode}
        values={values}
        onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
        onUploadImages={onUploadImages}
        onRemoveImage={onRemoveImage}
        onSubmit={onSubmit}
        saving={saving}
        uploading={uploading}
        error={error}
      />
    </div>
  );
}
