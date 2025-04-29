import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router";
import type { MemberSchema } from "../model/member";

export const columns: ColumnDef<MemberSchema>[] = [
  {
    id: "id",
    header: "#",
    cell: ({ row }) => {
      const data = row.original;

      return <Link to={`/members/${data.id}`}>{data.id}</Link>;
    },
  },
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
];
