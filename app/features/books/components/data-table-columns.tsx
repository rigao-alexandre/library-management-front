import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Form, Link } from "react-router";
import type { BookSchema } from "../model/book";
import { format, formatDistance } from "date-fns";

export const columns: ColumnDef<BookSchema>[] = [
  {
    id: "id",
    header: "#",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Button variant="link">
          <Link to={`/books/${data.id}`}>{data.id}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "dueDate",
    header: "Due date",
    cell: ({ row }) => {
      const data = row.original;

      return data.dueDate
        ? `${format(data.dueDate, "dd/MM/yyyy")} (${formatDistance(
            data.dueDate,
            new Date(),
            { addSuffix: true }
          )})`
        : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            {/* <MoreHorizontal className="h-4 w-4" /> */}
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button variant="link" className="space-x-1">
                <Link to={`/books/${data.id}/history`}>View history</Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Form
                id="books-event-form"
                method="post"
                action={`/books/${data.id}/${
                  data.status === "CHECKED IN" ? "check-out" : "check-in"
                }`}
              >
                <input type="hidden" name="id" value={data.id} />
                <Button
                  variant="link"
                  className="space-x-1 cursor-pointer"
                  type="submit"
                >
                  {data.status === "CHECKED IN" ? "Check out" : "Check in"}
                </Button>
              </Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
