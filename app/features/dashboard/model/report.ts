import { BookSchema, BookStatus } from "@/features/books/model/book";
import { HistoryEvent } from "@/features/history/model/history";
import { MemberSchema } from "@/features/members/model/member";
import { z } from "zod";

// export const HistorySchema = ResourceModel.extend({
//   bookId: z.coerce.number(),
//   memberId: z.coerce.number(),
//   event: z.enum(["CHECK IN", "CHECK OUT"]),
//   eventDate: z.string().nullable().optional(),
// });
// export type HistorySchema = z.infer<typeof HistorySchema>;

export const BookByStatus = z.array(
  z.object({
    status: BookStatus,
    total: z.number(),
  })
);
export type BookByStatus = z.infer<typeof BookByStatus>;

export const BooksByDeadline = z.object({
  total: z.number(),
  totalOnTime: z.number(),
  totalToday: z.number(),
  totalDelayed: z.number(),
});
export type BooksByDeadline = z.infer<typeof BooksByDeadline>;

export const BooksRanking = z.object({
  total: z.number(),
  book: BookSchema,
});
export type BooksRanking = z.infer<typeof BooksRanking>;

export const BooksReport = z.object({
  totalByStatus: BookByStatus,
  totalByDeadline: BooksByDeadline,
  rankings: z.object({
    monthly: z.array(BooksRanking),
  }),
});

export const MembersRanking = z.object({
  total: z.number(),
  member: MemberSchema,
});
export type MembersRanking = z.infer<typeof MembersRanking>;

export const MembersReport = z.object({
  total: z.number(),
  rankings: z.object({
    weekly: z.array(MembersRanking),
  }),
});

export const History = z.array(
  z.object({
    event: HistoryEvent,
    total: z.number(),
    date: z.string(),
  })
);
export type History = z.infer<typeof History>;

export const Dashboard = z.object({
  books: BooksReport,
  members: MembersReport,
  history: History,
});
