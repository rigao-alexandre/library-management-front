import type { Route } from "./+types/members_";
import {
  data,
  Link,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { Button } from "@/components/ui/button";
import { MemberService } from "@/lib/memberService";
import { columns } from "@/features/members/components/data-table-columns";
import { getFlashMessage } from "@/lib/flashMessage";
import { FlashMessage } from "@/components/layout/flash-message";
import { BaseLayout } from "@/components/layout/base-layout";
import { DataTable } from "@/components/data-table";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Manage members" },
    { name: "description", content: "Manage members" },
  ];
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getFlashMessage(request);
  const members = await new MemberService().getAll();

  return data(
    {
      members,
      flashMessage: session.data,
    },
    { headers: session.headers }
  );
};

export default function Members() {
  const { flashMessage, members } = useLoaderData<typeof loader>();

  return (
    <BaseLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Members</h2>
          <p className="text-muted-foreground">Manage members</p>
        </div>
        <div className="flex gap-2">
          <Link to="/members/new" className="space-x-1">
            <Button className="space-x-1">
              <span>Create</span> +
            </Button>
          </Link>
        </div>
      </div>
      <FlashMessage data={flashMessage} />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <DataTable columns={columns} data={members} />
      </div>
    </BaseLayout>
  );
}
