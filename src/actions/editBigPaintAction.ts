"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";
import { z } from "zod";

type Return = ActionReturn<{
  message: string;
}>;

const schema = z.object({
  name: z.string().trim().min(1),
  date: z.date(),
  relatedBigPaintsIds: z.array(z.string().trim().length(36)),
});

export async function editBigPaintAction(
  id: string,
  prevState: Awaited<Return>,
  formData: FormData,
): Return {
  if (!prevState.success) {
    return {
      success: false,
      errors: "Aborted because previous state is unsuccessful",
    };
  }

  // TODO: I'm supposing you always send the previous state + updates. Create my own form and just send the updates
  const validatedFields = schema.safeParse({
    name: formData.get("name"),
    date: formData.get("date")
      ? new Date(formData.get("date")!.toString())
      : formData.get("date"),
    relatedBigPaintsIds: formData.getAll("related_big_paints_ids"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, date, relatedBigPaintsIds } = validatedFields.data;

  await db
    .updateTable("big_paint")
    .where("id", "=", id)
    .set({
      name,
      date,
      related_big_paints_ids: relatedBigPaintsIds,
    })
    .execute();

  return {
    success: true,
    data: { message: "BigPaint edited successfully" },
  };
}
