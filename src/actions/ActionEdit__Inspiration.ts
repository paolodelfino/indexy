"use server";

import { db } from "@/db/db";
import { editInspirationFormSchema } from "@/schemas/schemaInspiration__Edit";
import { FormValues } from "@/utils/form";

export async function editInspirationAction(
  id: string,
  values: FormValues<typeof editInspirationFormSchema>,
) {
  const validated = editInspirationFormSchema.parse(values);
  await db
    .updateTable("inspiration")
    .where("id", "=", id)
    .set(validated)
    .execute();
}
