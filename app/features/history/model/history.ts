import { MemberSchema } from "@/features/members/model/member";
import { ResourceModel } from "@/lib/models";
import { z } from "zod";

export const HistoryEvent = z.enum(["CHECK IN", "CHECK OUT"]);

export const HistorySchema = ResourceModel.extend({
  bookId: z.coerce.number(),
  memberId: z.coerce.number(),
  event: HistoryEvent,
  eventDate: z.string().nullable().optional(),
});
export type HistorySchema = z.infer<typeof HistorySchema>;

export const HistoryWithRelated = HistorySchema.extend({
  member: MemberSchema,
});
export type HistoryWithRelated = z.infer<typeof HistoryWithRelated>;
