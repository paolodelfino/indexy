"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";
import { z } from "zod";

type Return = ActionReturn<{
  message: string;
}>;

const schema = z.object({
  content: z.string().trim().min(1),
});

export async function createInspirationAction(
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
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { content } = validatedFields.data;

  await db.insertInto("inspiration").values({ content }).execute();

  return {
    success: true,
    data: { message: "Inspiration created successfully" },
  };
}
