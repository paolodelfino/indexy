"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";
import { z } from "zod";

type Return = ActionReturn<{
  message: string;
}>;

const schema = z.object({
  name: z.string().trim().min(1),
});

export async function createBigPaintAction(
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
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name } = validatedFields.data;

  await db.insertInto("big_paint").values({ name }).execute();

  return {
    success: true,
    data: { message: "BigPaint created successfully" },
  };
}
