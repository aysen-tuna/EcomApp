export const ProductCategory = ["Clothing", "Bags", "Home", "Sports"] as const;

export type ProductCategory = (typeof ProductCategory)[number];
