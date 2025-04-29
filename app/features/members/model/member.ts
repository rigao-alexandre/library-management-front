import { z } from "zod";

export const MemberSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  email: z.string().email(),
  phone: z.string(),
});
export type MemberSchema = z.infer<typeof MemberSchema>;

export const MemberFormSchema = z.object({
  full_name: z.string().min(1, "Name is required."),
  email: z.string().email().min(1, "Email is required."),
  phone: z.string().min(1, "Phone is required."),
});
export type MemberFormSchema = z.infer<typeof MemberFormSchema>;

export const MemberDeleteSchema = z.object({
  id: z.coerce.number(),
});
export type MemberDeleteSchema = z.infer<typeof MemberDeleteSchema>;
