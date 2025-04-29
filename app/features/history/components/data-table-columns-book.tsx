import { type ColumnDef } from "@tanstack/react-table";
import type { HistoryWithRelated } from "../model/history";
import { format, formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const columns: ColumnDef<HistoryWithRelated>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    id: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const data = row.original;

      return `${format(data.createdAt, "dd/MM/yyyy")} (${formatDistance(
        data.createdAt,
        new Date(),
        { addSuffix: true }
      )})`;
    },
  },
  {
    accessorKey: "event",
    header: "Event type",
  },
  {
    id: "member",
    header: "Member",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Button variant="link">
          <Link to={`/members/${data.memberId}`}>{data.member.fullName}</Link>
        </Button>
      );
    },
  },
];
