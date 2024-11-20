"use server";

import { db } from "@/db/db";
import { editBigPaintFormSchema } from "@/schemas/schemaBigPaint__Edit";
import { FormValues } from "@/utils/form";

export async function editBigPaintAction(
  id: string,
  values: FormValues<typeof editBigPaintFormSchema>,
) {
  const validated = editBigPaintFormSchema.parse(values);
  await db
    .updateTable("big_paint")
    .where("id", "=", id)
    .set(validated)
    .execute();
}
