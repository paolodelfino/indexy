"use server";

import { db } from "@/db/db";
import { createInspirationFormSchema } from "@/schemas/createInspirationFormSchema";
import { FormValues } from "@/utils/form";

export async function createInspirationAction(
  values: FormValues<typeof createInspirationFormSchema>,
) {
  const validated = createInspirationFormSchema.parse(values);
  await db.insertInto("inspiration").values(validated).execute();
}
