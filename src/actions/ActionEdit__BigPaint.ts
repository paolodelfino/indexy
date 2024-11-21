"use server";

import { db } from "@/db/db";
import schemaBigPaint__Edit from "@/schemas/schemaBigPaint__Edit";
import { FormValues } from "@/utils/form";

export default async function ActionEdit__BigPaint(
  id: string, 
  values: FormValues<typeof schemaBigPaint__Edit>,
) {
  const validated = schemaBigPaint__Edit.parse(values);
  await db
    .updateTable("big_paint")
    .where("id", "=", id)
    .set(validated)
    .execute();
}
