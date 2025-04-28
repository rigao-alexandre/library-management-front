import type { Route } from "./+types/books.delete";
import { redirect } from "react-router";
import { BookService } from "@/lib/bookService";
import { BookDeleteSchema } from "@/features/books/model/book";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = BookDeleteSchema.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, data: undefined, result: parsed.error } as const;
  }

  try {
    await new BookService().delete(parsed.data.id);

    return redirect(`/books`);
  } catch (error) {
    return { success: false, data: undefined };
  }
};
