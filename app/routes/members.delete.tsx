import type { Route } from "./+types/members.delete";
import { redirect } from "react-router";
import { MemberService } from "@/lib/memberService";
import { MemberDeleteSchema } from "@/features/members/model/member";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const payload = Object.fromEntries(formData);

  const parsed = MemberDeleteSchema.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, data: undefined, result: parsed.error } as const;
  }

  try {
    await new MemberService().delete(parsed.data.id);

    return redirect(`/members`);
  } catch (error) {
    return { success: false, data: undefined };
  }
};
