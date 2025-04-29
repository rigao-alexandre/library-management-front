import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Route } from "./+types/members.$id";
import {
  Form as RRForm,
  redirect,
  useLoaderData,
  useSubmit,
} from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MemberService } from "@/lib/memberService";
import { ConfirmDialog } from "@/components/confirm-dialog";
import useDialogState from "@/hooks/use-dialog-state";
import { useRef } from "react";
import { setFlashMessage } from "@/lib/flashMessage";
import { MemberFormSchema } from "@/features/members/model/member";
import { BaseLayout } from "@/components/layout/base-layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Edit member" },
    { name: "description", content: "Edit member" },
  ];
}

export const loader = async ({ params }: Route.LoaderArgs) => {
  const id = +(params.id ?? 0);

  const member = await new MemberService().getByID(id);

  return {
    id,
    defaultValues: member ?? {
      full_name: "",
      email: "",
      phone: "",
    },
  };
};

export const action = async ({ params, request }: Route.ActionArgs) => {
  const id = +(params.id ?? 0);

  if (!id) {
    return redirect(`/member`);
  }

  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = MemberFormSchema.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, data: undefined, result: parsed.error } as const;
  }

  try {
    await new MemberService().update(id, parsed.data);

    const { headers } = await setFlashMessage(request, {
      message: "Success",
    });

    return redirect(`/member`, { headers });
  } catch (error) {
    return { success: false, data: undefined };
  }
};

export default function MemberDetail() {
  const { id, defaultValues } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  const form = useForm<MemberFormSchema>({
    resolver: zodResolver(MemberFormSchema),
    defaultValues,
  });

  const onSubmit = (data: MemberFormSchema) => {
    submit(data, { method: "post" });
    form.reset();
  };

  const deleteFormRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useDialogState<"delete">(null);

  return (
    <BaseLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Members</h2>
          <p className="text-muted-foreground">
            Edit member - {defaultValues.full_name}
          </p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <Form {...form}>
          <form
            id="members-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-5 px-4"
          >
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Phone" type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              form="members-form"
              type="submit"
              value="update"
              name="_action"
            >
              Save changes
            </Button>

            <Button
              // form="members-delete-form"
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
          id="members-delete-form"
          method="delete"
          action="/members/delete"
          ref={deleteFormRef}
        >
          <input type="hidden" name="id" value={id} />
        </RRForm>

        <ConfirmDialog
          key="member-delete"
          destructive
          open={open === "delete"}
          onOpenChange={() => {
            setOpen("delete");
          }}
          handleConfirm={() => {
            setOpen(null);
            setTimeout(() => {
              deleteFormRef.current?.requestSubmit();
            }, 500);
          }}
          className="max-w-md"
          title={`Delete this member: ${id}?`}
          desc={
            <>
              You are about to delete a member with the ID <strong>{id}</strong>
              .
              <br />
              This action cannot be undone.
            </>
          }
          confirmText="Delete"
        />
      </div>
    </BaseLayout>
  );
}
