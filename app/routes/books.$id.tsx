import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Route } from "./+types/books.$id";
import { z } from "zod";
import {
  Form as RRForm,
  redirect,
  useFormAction,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Main } from "@/components/layout/main";
import { Button } from "@/components/ui/button";
import { BookService } from "@/lib/bookService";
import { ConfirmDialog } from "@/components/confirm-dialog";
import useDialogState from "@/hooks/use-dialog-state";
import { useRef } from "react";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  author: z.string().min(1, "Author is required."),
  isbn: z.string().min(1, "ISBN is required."),
  description: z.string().min(1, "Description is required."),
});
type FormSchema = z.infer<typeof FormSchema>;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit book" },
    { name: "description", content: "Edit book" },
  ];
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  const id = +(params.id ?? 0);

  const book = await new BookService().getByID(id);

  return {
    id,
    defaultValues: book ?? {
      title: "",
      author: "",
      isbn: "",
      description: "",
    },
  };
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  const id = +(params.id ?? 0);

  if (!id) {
    return redirect(`/books`);
  }

  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = FormSchema.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, data: undefined, result: parsed.error } as const;
  }

  try {
    await new BookService().update(id, parsed.data);

    return redirect(`/books`);
  } catch (error) {
    return { success: false, data: undefined };
  }
};

export default function BookDetail({ params }: Route.ActionArgs) {
  const { id, defaultValues } = useLoaderData<typeof loader>();

  // const navigate = useNavigate();

  const submit = useSubmit();
  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
    submit(data, { method: "post" });
    // do something with the form data
    form.reset();
    // navigate("/books");
  };

  // console.log(useFormAction("delete"));

  const deleteFormRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useDialogState<"delete">(null);

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

            <Button
              form="books-form"
              type="submit"
              value="update"
              name="_action"
            >
              Save changes
            </Button>

            <Button
              // form="books-delete-form"
              // type="submit"
              // variant="destructive"
              // value="delete"
              // name="_action"
              type="button"
              onClick={() => setOpen("delete")}
            >
              Delete
            </Button>
          </form>
        </Form>

        <RRForm
          id="books-delete-form"
          method="delete"
          action="/books/delete"
          // onSubmit={(event) => {
          //   if (!confirm("Are you sure?")) {
          //     event.preventDefault();
          //   }
          // }}
          ref={deleteFormRef}
        >
          <input type="hidden" name="id" value={id} />
        </RRForm>

        <ConfirmDialog
          key="book-delete"
          destructive
          open={open === "delete"}
          onOpenChange={() => {
            setOpen("delete");
            setTimeout(() => {
              // setCurrentRow(null);
            }, 500);
          }}
          handleConfirm={() => {
            setOpen(null);
            setTimeout(() => {
              // if (deleteFormRef.current) {
              deleteFormRef.current?.requestSubmit();
              // }
              // setCurrentRow(null);
            }, 500);
            // showSubmittedData(
            //   currentRow,
            //   "The following task has been deleted:"
            // );
          }}
          className="max-w-md"
          title={`Delete this book: ${id}?`}
          desc={
            <>
              You are about to delete a book with the ID <strong>{id}</strong>.
              <br />
              This action cannot be undone.
            </>
          }
          confirmText="Delete"
        />
      </div>
    </Main>
  );
}
