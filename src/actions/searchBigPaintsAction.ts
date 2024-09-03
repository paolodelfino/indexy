"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";
import { z } from "zod";

type Return = ActionReturn<{ id: string; name: string }[]>;

const schema = z.object({
  query: z.string().trim().min(1),
});

export async function searchBigPaintsAction(
  prevState: Awaited<Return>,
  formData: FormData,
): Return {
  if (!prevState.success) {
    return {
      success: false,
      errors: "Aborted because previous state is unsuccessful",
    };
  }

  const validatedFields = schema.safeParse({
    query: formData.get("query"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { query } = validatedFields.data;

  return {
    success: true,
    data: await db
      .selectFrom("big_paint")
      .where("name", "~*", `^${query}`)
      .select(["id", "name"])
      .execute(),
  };
}
