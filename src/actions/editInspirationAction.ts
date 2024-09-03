"use server";
import { db } from "@/db/db";
import { ActionReturn } from "@/utils/actionType";
import { z } from "zod";

type Return = ActionReturn<{
  message: string;
}>;

const schema = z.object({
  content: z.string().trim().min(1),
  date: z.date(),
  highlight: z.boolean(),
  relatedBigPaintsIds: z.array(z.string().trim().length(36)),
  relatedInspirationsIds: z.array(z.string().trim().length(36)),
});

export async function editInspirationAction(
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
    content: formData.get("content"),
    date: formData.get("date")
      ? new Date(formData.get("date")!.toString())
      : formData.get("date"),
    highlight: formData.get("highlight") === "on",
    relatedBigPaintsIds: formData.getAll("related_big_paints_ids"),
    relatedInspirationsIds: formData.getAll("related_inspirations_ids"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    content,
    date,
    highlight,
    relatedBigPaintsIds,
    relatedInspirationsIds,
  } = validatedFields.data;

  await db
    .updateTable("inspiration")
    .where("id", "=", id)
    .set({
      content,
      date,
      highlight,
      related_big_paints_ids: relatedBigPaintsIds,
      related_inspirations_ids: relatedInspirationsIds,
    })
    .execute();

  return {
    success: true,
    data: { message: "Inspiration edited successfully" },
  };
}
