import type { Route } from "./+types/books.$id.check-out";
import {
  data,
  redirect,
  useLoaderData,
  useSubmit,
  type LoaderFunctionArgs,
} from "react-router";
import { BookService } from "@/lib/bookService";
import { columns } from "@/features/books/components/data-table-columns";
import { BaseLayout } from "@/components/layout/base-layout";
import { DataTable } from "@/components/data-table";
import { GetSchema } from "@/lib/models";
import { MemberService } from "@/lib/memberService";
import { useForm } from "react-hook-form";
import {
  BookCheckoutFormSchema,
  BookCheckoutSchema,
} from "@/features/books/model/book";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { addDays, format, parseISO, setDate } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setFlashMessage } from "@/lib/flashMessage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Check out book" },
    { name: "description", content: "Check out book" },
  ];
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = GetSchema.parse(params);

  const book = await new BookService().getByID(id);
  const members = await new MemberService().getAll();

  return data({
    id,
    book,
    members,
    defaultValues: {
      memberId: 0,
      dueDate: null,
    },
  });
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  const { id } = GetSchema.parse(params);

  if (!id) {
    return redirect(`/books`);
  }

  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = BookCheckoutSchema.safeParse({
    ...payload,
    bookId: id,
  });

  if (!parsed.success) {
    return { ok: false, data: undefined, result: parsed.error } as const;
  }

  try {
    await new BookService().checkOut(id, parsed.data);

    const { headers } = await setFlashMessage(request, {
      message: "Book checked out with success",
    });

    return redirect(`/books`, { headers });
  } catch (error) {
    return { success: false, data: undefined };
  }
};

export default function BookCheckOut() {
  const { id, defaultValues, book, members } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  const form = useForm<BookCheckoutFormSchema>({
    resolver: zodResolver(BookCheckoutFormSchema),
    defaultValues,
  });

  const data = members.map((item) => ({
    value: item.id,
    label: item.fullName,
  }));

  const onSubmit = (data: BookCheckoutFormSchema) => {
    submit(
      data,
      // {
      //   // ...data,
      //   // bookId: id,
      //   // event: "CHECK OUT",
      // },
      { method: "post" }
    );
    form.reset();
  };

  return (
    <BaseLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Check out book</h2>
          <p className="text-muted-foreground">{book.title}</p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <Form {...form}>
          <form
            id="book-checkout-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-5 px-4"
          >
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Member</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? data.find((item) => item.value === field.value)
                                ?.label
                            : "Select member"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search member..." />
                        <CommandList>
                          <CommandEmpty>No member found.</CommandEmpty>
                          <CommandGroup>
                            {data.map((item) => (
                              <CommandItem
                                value={item.label}
                                key={item.value}
                                onSelect={() => {
                                  form.setValue("memberId", item.value);
                                }}
                              >
                                {item.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    item.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                      <Select
                        onValueChange={(value) =>
                          field.onChange(
                            addDays(new Date(), parseInt(value)).toISOString()
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {/* <SelectItem value="0">Today</SelectItem> */}
                          <SelectItem value="1">Tomorrow</SelectItem>
                          <SelectItem value="3">In 3 days</SelectItem>
                          <SelectItem value="5">In 5 days</SelectItem>
                          <SelectItem value="7">In a week</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="rounded-md border">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? parseISO(field.value) : undefined
                          }
                          onSelect={(value) =>
                            field.onChange(
                              value ? value.toISOString() : undefined
                            )
                          }
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              form="book-checkout-form"
              type="submit"
              value="update"
              name="_action"
            >
              Check out
            </Button>
          </form>
        </Form>
      </div>
    </BaseLayout>
  );
}
