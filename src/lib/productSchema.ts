import { z } from "zod";
import { ProductCategory } from "@/lib/productCategories";

export const productSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional().default(""),
  brand: z.string().trim().optional().default(""),
  serialNumber: z.string().trim().min(1, "Serial Number is required"),
  category: z.enum(ProductCategory).default("Clothing"),

  price: z.object({
    amount: z.coerce.number().positive("Price must be greater than 0"),
    currency: z.literal("EUR"),
  }),

  taxRate: z.coerce.number().min(0).max(100).default(18),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  draft: z.boolean().default(false),

  discount: z
    .object({
      rate: z.coerce.number().min(0).max(100),
    })
    .optional(),

  imageUrls: z.array(z.string().url()).min(1, "At least 1 image is required"),
});
