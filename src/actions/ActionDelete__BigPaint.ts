"use server";

import { db } from "@/db/db";
import { deleteBigPaintFormSchema } from "@/schemas/schemaBigPaint__Delete";
import { FormValues } from "@/utils/form";

export async function deleteBigPaintAction(
  values: FormValues<typeof deleteBigPaintFormSchema>,
) {
  const validated = deleteBigPaintFormSchema.parse(values);
  await db.deleteFrom("big_paint").where("id", "=", validated.id).execute();
}
