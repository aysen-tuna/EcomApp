"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/AuthProvider";
import { createProduct } from "@/lib/products";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { SimpleField } from "@/components/SimpleField";
import { Label } from "@/components/ui/label";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [taxRate, setTaxRate] = useState("18");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("0");
  const [draft, setDraft] = useState(false);
  const [discountRate, setDiscountRate] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [pathname]);

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/user/login");
      else if (!isAdmin) router.replace("/");
    }
  }, [user, isAdmin, loading, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.uid) {
      setError("Not authenticated");
      return;
    }

    try {
      setBusy(true);

      await createProduct({
        title,
        description,
        brand,
        serialNumber,
        category,
        price: { amount: Number(price || 0), currency: "EUR" },
        taxRate: Number(taxRate),
        image,
        stock: Number(stock),
        draft,
        discount: discountRate ? { rate: Number(discountRate) } : undefined,
        createdBy: user.uid,
      });

      setSuccess("Product created!");
      setTitle("");
      setDescription("");
      setBrand("");
      setSerialNumber("");
      setCategory("");
      setPrice("");
      setTaxRate("18");
      setImage("");
      setStock("0");
      setDraft(false);
      setDiscountRate("");
    } catch (err: any) {
      setError(err?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  if (loading || !isAdmin) return null;

  return (
    <div className="max-w-2xl w-full mx-auto mt-16 mb-12">
      <Card className="shadow-xl rounded-2xl">
        <CardHeader className="px-8 py-4">
          <CardTitle>Add Product</CardTitle>
        </CardHeader>

        <CardContent className="px-8 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SimpleField
              label="Title"
              value={title}
              onChange={setTitle}
              required
            />

            <SimpleField
              label="Description"
              value={description}
              onChange={setDescription}
            />

            <SimpleField label="Brand" value={brand} onChange={setBrand} />

            <SimpleField
              label="Serial Number"
              value={serialNumber}
              onChange={setSerialNumber}
            />

            <SimpleField
              label="Category"
              value={category}
              onChange={setCategory}
            />

            <SimpleField
              label="Price (EUR)"
              type="number"
              value={price}
              onChange={setPrice}
              min={0}
              required
            />

            <SimpleField
              label="Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={setTaxRate}
            />

            <SimpleField
              label="Stock"
              type="number"
              value={stock}
              onChange={setStock}
            />

            <SimpleField label="Image URL" value={image} onChange={setImage} />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft}
                onChange={(e) => setDraft(e.target.checked)}
                className="h-4 w-4"
              />
              <Label>Draft</Label>
            </div>

            <SimpleField
              label="Discount Rate (%)"
              type="number"
              value={discountRate}
              onChange={setDiscountRate}
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Button disabled={busy} className="w-full">
              {busy ? "Saving..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
