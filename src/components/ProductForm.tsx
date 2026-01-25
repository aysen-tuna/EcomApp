"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SimpleField } from "@/components/SimpleField";

export type ProductValues = {
  title: string;
  description: string;
  brand: string;
  serialNumber: string;
  category: string;
  price: string;
  taxRate: string;
  stock: string;
  draft: boolean;
  discountRate: string;
  imageUrls: string[];
};

type Props = {
  mode: "create" | "edit";
  values: ProductValues;
  onChange: (patch: Partial<ProductValues>) => void;

  onUploadImages: (files: FileList | null) => void;
  onRemoveImage: (url: string) => void;

  onSubmit: (e: React.FormEvent) => void;

  saving?: boolean;
  uploading?: boolean;
  error?: string;
};

export function ProductForm({
  mode,
  values,
  onChange,
  onUploadImages,
  onRemoveImage,
  onSubmit,
  saving = false,
  uploading = false,
  error = "",
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-12 bg-neutral-100 dark:bg-neutral-900 rounded-md space-y-6 w-full"
      noValidate
    >
      <h2 className="text-xl font-semibold">
        {mode === "create" ? "Add Product" : "Edit Product"}
      </h2>

      <SimpleField
        id="title"
        label="Title"
        value={values.title}
        onChange={(v) => onChange({ title: v })}
      />

      <SimpleField
        id="description"
        label="Description"
        value={values.description}
        onChange={(v) => onChange({ description: v })}
      />

      <SimpleField
        id="brand"
        label="Brand"
        value={values.brand}
        onChange={(v) => onChange({ brand: v })}
      />

      <SimpleField
        id="serialNumber"
        label="Serial Number"
        value={values.serialNumber}
        onChange={(v) => onChange({ serialNumber: v })}
      />

      <SimpleField
        id="category"
        label="Category"
        value={values.category}
        onChange={(v) => onChange({ category: v })}
      />

      <SimpleField
        id="price"
        label="Price (EUR)"
        type="number"
        value={values.price}
        onChange={(v) => onChange({ price: v })}
      />

      <SimpleField
        id="taxRate"
        label="Tax Rate (%)"
        type="number"
        value={values.taxRate}
        onChange={(v) => onChange({ taxRate: v })}
      />

      <SimpleField
        id="stock"
        label="Stock"
        type="number"
        value={values.stock}
        onChange={(v) => onChange({ stock: v })}
      />

      <div className="grid gap-2">
        <Label>Images</Label>

        {values.imageUrls.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {values.imageUrls.map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt="product"
                  className="w-full h-32 object-cover rounded-md border"
                />

                <Button
                  type="button"
                  variant="secondary"
                  className="absolute top-2 right-2 h-8 px-2"
                  onClick={() => onRemoveImage(url)}
                  disabled={uploading || saving}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-70">No images yet.</p>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading || saving}
          onChange={(e) => onUploadImages(e.target.files)}
        />

        {uploading ? <p className="text-sm opacity-70">Uploading...</p> : null}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={values.draft}
          onChange={(e) => onChange({ draft: e.target.checked })}
          className="h-4 w-4"
        />
        <Label>Draft</Label>
      </div>

      <SimpleField
        id="discountRate"
        label="Discount Rate (%)"
        type="number"
        value={values.discountRate}
        onChange={(v) => onChange({ discountRate: v })}
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <Button
        type="submit"
        name="addEditProduct"
        className="w-full"
        disabled={saving || uploading}
      >
        {saving
          ? "Saving..."
          : mode === "create"
            ? "Save Product"
            : "Update Product"}
      </Button>
    </form>
  );
}
