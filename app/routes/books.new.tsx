import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Route } from "./+types/books.new";
import { redirect, useLoaderData, useNavigate, useSubmit } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { BookService } from "@/lib/bookService";
import { setFlashMessage } from "@/lib/flashMessage";
import { BookFormSchema } from "@/features/books/model/book";
import { Header } from "@/components/layout/header";
import { BaseLayout } from "@/components/layout/base-layout";

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

  const parsed = BookFormSchema.safeParse(payload);

  if (!parsed.success) {
    const { headers } = await setFlashMessage(request, {
      message: "Error",
    });
    return redirect(`/books`, { headers });
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

export default function BooksNew() {
  const { defaultValues } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  const form = useForm<BookFormSchema>({
    resolver: zodResolver(BookFormSchema),
    defaultValues,
  });

  const onSubmit = (data: BookFormSchema) => {
    submit(data, { method: "post" });
    form.reset();
  };

  return (
    <BaseLayout>
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
    </BaseLayout>
  );
}
