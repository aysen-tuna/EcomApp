import { ProductValues } from "@/components/ProductForm";

export function buildProductRaw(values: ProductValues) {
  return {
    title: values.title,
    description: values.description,
    brand: values.brand,
    serialNumber: values.serialNumber,
    category: values.category,
    price: { amount: Number(values.price), currency: "EUR" as const },
    taxRate: Number(values.taxRate),
    stock: Number(values.stock),
    draft: values.draft,
    discount: values.discountRate
      ? { rate: Number(values.discountRate) }
      : undefined,

    imageUrls: values.imageUrls,
  };
}
