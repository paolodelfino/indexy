"use server";

import { db } from "@/db/db";
import schemaBigPaint__Create from "@/schemas/schemaBigPaint__Create";
import { FormValues } from "@/utils/form";

export default async function (
  values: FormValues<typeof schemaBigPaint__Create>,
) {
  const validated = schemaBigPaint__Create.parse(values);
  await db.insertInto("big_paint").values(validated).execute();
}
