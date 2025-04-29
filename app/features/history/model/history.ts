import { MemberSchema } from "@/features/members/model/member";
import { ResourceModel } from "@/lib/models";
import { z } from "zod";

export const HistorySchema = ResourceModel.extend({
  bookId: z.number(),
  memberId: z.number(),
  event: z.enum(["CHECK IN", "CHECK OUT"]),
  eventDate: z.string().nullable().optional(),
});
export type HistorySchema = z.infer<typeof HistorySchema>;

export const HistoryWithRelated = HistorySchema.extend({
  member: MemberSchema,
});
export type HistoryWithRelated = z.infer<typeof HistoryWithRelated>;
