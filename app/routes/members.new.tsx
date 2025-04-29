import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Route } from "./+types/members.new";
import { redirect, useLoaderData, useSubmit } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MemberService } from "@/lib/memberService";
import { setFlashMessage } from "@/lib/flashMessage";
import { MemberFormSchema } from "@/features/members/model/member";
import { BaseLayout } from "@/components/layout/base-layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Add new book" },
    { name: "description", content: "Add new book" },
  ];
}

export const loader = async () => {
  return {
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = MemberFormSchema.safeParse(payload);

  if (!parsed.success) {
    const { headers } = await setFlashMessage(request, {
      message: "Error",
    });
    return redirect(`/members`, { headers });
  }

  try {
    await new MemberService().create(parsed.data);

    const { headers } = await setFlashMessage(request, {
      message: "Success",
    });
    return redirect(`/members`, { headers });
  } catch (error) {
    return { success: false, data: undefined };
  }
};

export default function MembersNew() {
  const { defaultValues } = useLoaderData<typeof loader>();

  const submit = useSubmit();
  const form = useForm<MemberFormSchema>({
    resolver: zodResolver(MemberFormSchema),
    defaultValues,
  });

  const onSubmit = (data: MemberFormSchema) => {
    submit(data, { method: "post" });
    form.reset();
  };

  return (
    <BaseLayout>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Members</h2>
          <p className="text-muted-foreground">Add new member</p>
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
              name="fullName"
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

            <Button form="members-form" type="submit">
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    </BaseLayout>
  );
}
