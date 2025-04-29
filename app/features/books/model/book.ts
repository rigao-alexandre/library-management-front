import { DeleteSchema, ResourceModel } from "@/lib/models";
import { z } from "zod";

export const BookSchema = ResourceModel.extend({
  title: z.string(),
  author: z.string(),
  isbn: z.string(),
  description: z.string(),
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
