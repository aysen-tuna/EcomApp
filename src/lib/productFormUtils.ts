import { ProductValues } from "@/components/ProductForm";

export function buildProductRaw(values: ProductValues) {
  return {
    title: values.title,
    description: values.description,
    brand: values.brand,
    serialNumber: values.serialNumber,
    category: values.category,
    price: { amount: values.price, currency: "EUR" as const },
    taxRate: values.taxRate,
    stock: values.stock,
    draft: values.draft,
    discount: values.discountRate ? { rate: values.discountRate } : undefined,
    imageUrls: values.imageUrls,
  };
}
