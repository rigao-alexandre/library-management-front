import { z } from "zod";

export const ResourceModel = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
