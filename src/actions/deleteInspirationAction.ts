"use server";
import { db } from "@/db/db";
import { deleteInspirationFormSchema } from "@/schemas/deleteInspirationFormSchema";
import { FormValues } from "@/utils/form";

export async function deleteInspirationAction(
  values: FormValues<typeof deleteInspirationFormSchema>,
) {
  const validated = deleteInspirationFormSchema.parse(values);
  await db.deleteFrom("big_paint").where("id", "=", validated.id).execute();
}
