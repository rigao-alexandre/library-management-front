import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Route } from "./+types/books.new";
import { z } from "zod";
import { redirect, useLoaderData, useNavigate, useSubmit } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { BookService } from "@/lib/bookService";
import { setFlashMessage } from "@/lib/flashMessage";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  author: z.string().min(1, "Author is required."),
  isbn: z.string().min(1, "ISBN is required."),
  description: z.string().min(1, "Description is required."),
});
type FormSchema = z.infer<typeof FormSchema>;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add new book" },
    { name: "description", content: "Add new book" },
  ];
}

export const loader = async () => {
  return {
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      description: "",
    },
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = FormSchema.safeParse(payload);

  if (!parsed.success) {
    const { headers } = await setFlashMessage(request, {
      message: "Error",
    });
    return redirect(`/books`, { headers });
    // return { ok: false, data: undefined, result: parsed.error } as const;
  }

  try {
    await new BookService().create(parsed.data);

    const { headers } = await setFlashMessage(request, {
      message: "Success",
    });
    return redirect(`/books`, { headers });
  } catch (error) {
    return { success: false, data: undefined };
  }
};

export default function Books() {
  const { defaultValues } = useLoaderData<typeof loader>();

  // const navigate = useNavigate();

  const submit = useSubmit();
  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onSubmit = (data: FormSchema) => {
    submit(data, { method: "post" });
    // do something with the form data
    form.reset();
    // navigate("/books");
  };

  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Books</h2>
          <p className="text-muted-foreground">Add new book</p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <Form {...form}>
          <form
            id="books-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-5 px-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter a title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the author" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the ISBN" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter a description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button form="books-form" type="submit">
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    </Main>
  );
}
