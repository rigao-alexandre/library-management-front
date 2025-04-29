import type { Route } from "./+types/books.$id.check-out";
import { redirect } from "react-router";
import { BookService } from "@/lib/bookService";
import { GetSchema } from "@/lib/models";
import { BookCheckinSchema } from "@/features/books/model/book";
import { setFlashMessage } from "@/lib/flashMessage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Check in book" },
    { name: "description", content: "Check in book" },
  ];
}

export const action = async ({ params, request }: Route.ActionArgs) => {
  const { id } = GetSchema.parse(params);

  if (!id) {
    return redirect(`/books`);
  }

  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = BookCheckinSchema.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, data: undefined, result: parsed.error } as const;
  }

  try {
    await new BookService().checkIn(id);

    const { headers } = await setFlashMessage(request, {
      message: "Book checked in with success",
    });

    return redirect(`/books`, { headers });
  } catch (error) {
    return { success: false, data: undefined };
  }
};
