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
import { Link } from "react-router";
import type { BookSchema } from "../model/book";

export const columns: ColumnDef<BookSchema>[] = [
  {
    id: "id",
    header: "#",
    cell: ({ row }) => {
      const data = row.original;

      return <Link to={`/books/${data.id}`}>{data.id}</Link>;
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const book = row.original;

  //     return (
  //       <DropdownMenu modal={false}>
  //         <DropdownMenuTrigger asChild>
  //           {/* <MoreHorizontal className="h-4 w-4" /> */}
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
