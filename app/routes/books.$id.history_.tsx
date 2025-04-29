import type { Route } from "./+types/books.$id.history_";
import { data, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { BookService } from "@/lib/bookService";
import { BaseLayout } from "@/components/layout/base-layout";
import { DataTable } from "@/components/data-table";
import { GetSchema } from "@/lib/models";
import { columns } from "@/features/history/components/data-table-columns-book";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Book history" },
    { name: "description", content: "Book history" },
  ];
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = GetSchema.parse(params);

  const bookService = new BookService();

  const book = await bookService.getByID(id);
  const history = await bookService.getAllHistory(id);

  return data({
    id,
    book,
    history,
  });
};

export default function BookHistory() {
  const { id, book, history } = useLoaderData<typeof loader>();

  return (
    <BaseLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">History</h2>
          <p className="text-muted-foreground">History for {book.title}</p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <DataTable columns={columns} data={history} />
      </div>
    </BaseLayout>
  );
}
