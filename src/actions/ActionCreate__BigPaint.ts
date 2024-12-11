"use server";

import { db } from "@/r/db";
import schemaBigPaint__Create from "@/schemas/schemaBigPaint__Create";
import { FormValues } from "@/utils/form";

export default async function ActionCreate__BigPaint(
  values: FormValues<typeof schemaBigPaint__Create>,
) {
  const validated = schemaBigPaint__Create.parse(values);
  const result = await db
    .insertInto("big_paint")
    .values(validated)
    .returning("id")
    .executeTakeFirstOrThrow();
  return result.id;
}
