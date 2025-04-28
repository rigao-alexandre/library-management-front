import { Main } from "@/components/layout/main";
import type { Route } from "./+types/home";
import {
  data,
  Link,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { Button } from "@/components/ui/button";
import { BookService } from "@/lib/bookService";
import { columns } from "@/features/books/components/data-table-columns";
import { DataTable } from "@/features/books/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getFlashMessage } from "@/lib/flashMessage";
import { FlashMessage } from "@/components/layout/flash-message";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { MainNav } from "@/components/layout/main-nav";
import { Separator } from "@/components/ui/separator";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getFlashMessage(request);
  const books = await new BookService().getAll();

  return data(
    {
      books,
      flashMessage: session.data,
    },
    { headers: session.headers }
  );
};

export default function Books() {
  const { flashMessage, books } = useLoaderData<typeof loader>();

  if (flashMessage?.message) {
    toast(flashMessage?.message);
  }

  return (
    <>
      <Header />

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Books</h2>
            <p className="text-muted-foreground">Manage books</p>
          </div>
          <div className="flex gap-2">
            <Link to="/books/new" className="space-x-1">
              <Button className="space-x-1">
                <span>Create</span> +
              </Button>
            </Link>
          </div>
        </div>
        {/* <FlashMessage data={flashMessage} /> */}
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {/* <DataTable data={tasks} columns={columns} /> */}
          <DataTable columns={columns} data={books} />
        </div>
        {/* <div className="container mx-auto py-10">
        <DataTable columns={columns} data={books} />
      </div> */}
      </Main>
    </>
  );
}
