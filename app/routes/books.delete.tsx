import type { Route } from "./+types/books.delete";
import { z } from "zod";
import { redirect } from "react-router";
import { BookService } from "@/lib/bookService";

const FormSchema = z.object({
  id: z.coerce.number(),
});
type FormSchema = z.infer<typeof FormSchema>;

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "Delete book" },
//     { name: "description", content: "Delete book" },
//   ];
// }

// export const loader = async ({ params }: Route.LoaderArgs) => {
//   const book = await new BookService().getByID(+(params.id ?? 0));

//   return {
//     defaultValues: book ?? {
//       title: "",
//       author: "",
//       isbn: "",
//       description: "",
//     },
//   };
// };

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = FormSchema.safeParse(payload);

  console.log(payload, parsed);

  if (!parsed.success) {
    return { ok: false, data: undefined, result: parsed.error } as const;
  }

  try {
    console.log(await new BookService().delete(parsed.data.id));

    return redirect(`/books`);
  } catch (error) {
    return { success: false, data: undefined };
  }
};
