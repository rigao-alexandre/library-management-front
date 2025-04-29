import { z } from "zod";

export const ResourceModel = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const IdSchema = z.object({
  id: z.coerce.number(),
});

export const DeleteSchema = IdSchema;

export const GetSchema = IdSchema;
