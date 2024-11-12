"use server";
import { db } from "@/db/db";
import { createBigPaintFormSchema } from "@/schemas/createBigPaintFormSchema";
import { FormValues } from "@/utils/form2";

export async function createBigPaintAction(
  values: FormValues<typeof createBigPaintFormSchema>,
) {
  const validated = createBigPaintFormSchema.parse(values);
  await db.insertInto("big_paint").values(validated).execute();
}
