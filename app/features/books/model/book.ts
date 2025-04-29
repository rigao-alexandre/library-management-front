import { DeleteSchema, IdSchema, ResourceModel } from "@/lib/models";
import { z } from "zod";

export const BookSchema = ResourceModel.extend({
  title: z.string(),
  author: z.string(),
  isbn: z.string(),
  description: z.string(),
  status: z.enum(["CHECKED IN", "CHECKED OUT"]),
  memberId: z.number().nullable().optional(),
  dueDate: z.string().nullable().optional(),
});
export type BookSchema = z.infer<typeof BookSchema>;

export const BookFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  author: z.string().min(1, "Author is required."),
  isbn: z.string().min(1, "ISBN is required."),
  description: z.string().min(1, "Description is required."),
});
export type BookFormSchema = z.infer<typeof BookFormSchema>;

export const BookDeleteSchema = DeleteSchema;
export type BookDeleteSchema = z.infer<typeof BookDeleteSchema>;

export const BookCheckoutFormSchema = z.object({
  memberId: z.coerce.number(),
  dueDate: z.string().nullable().optional(),
});
export type BookCheckoutFormSchema = z.infer<typeof BookCheckoutFormSchema>;

export const BookCheckoutSchema = BookCheckoutFormSchema.extend({
  bookId: z.coerce.number(),
});
export type BookCheckoutSchema = z.infer<typeof BookCheckoutSchema>;

export const BookCheckinSchema = IdSchema;
export type BookCheckinSchema = z.infer<typeof BookCheckinSchema>;
