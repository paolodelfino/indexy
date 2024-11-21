"use server";

import { db } from "@/db/db";
import schemaBigPaint__Delete from "@/schemas/schemaBigPaint__Delete";
import { FormValues } from "@/utils/form";

export default async function ActionDelete__BigPaint(
  values: FormValues<typeof schemaBigPaint__Delete>,
) {
  const validated = schemaBigPaint__Delete.parse(values);
  await db.deleteFrom("big_paint").where("id", "=", validated.id).execute();
}
