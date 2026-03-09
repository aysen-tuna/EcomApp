export const ProductCategories = ['Clothing', 'Bags', 'Home', 'Sports'] as const;

export type ProductCategory = (typeof ProductCategories)[number];
