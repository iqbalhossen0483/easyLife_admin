import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  short_name: z.string().optional(),
  type: z.string().optional(),
  cost: z.number().min(0, "Cost must be 0 or greater"),
  price: z.number().min(0, "Price must be 0 or greater"),
  sl: z.number().optional(),
  init_stock: z.number().optional(),
  image: z.custom<FileList | undefined>().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
