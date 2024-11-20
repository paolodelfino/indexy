"use server";

import { db } from "@/db/db";
import schemaBigPaint__Edit from "@/schemas/schemaBigPaint__Edit";
import { FormValues } from "@/utils/form";

export default async function (
  id: string, // TODO: Mettilo nel form (forse non conviene per il field)
  values: FormValues<typeof schemaBigPaint__Edit>,
) {
  const validated = schemaBigPaint__Edit.parse(values);
  await db
    .updateTable("big_paint")
    .where("id", "=", id)
    .set(validated)
    .execute();
}
