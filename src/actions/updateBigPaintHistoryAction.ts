"use server";

import { db } from "@/db/db";
import updateHistorySchema from "@/schemas/updateHistorySchema";
import { FormValues } from "@/utils/form";

export default async function updateBigPaintHistoryAction(
  values: FormValues<typeof updateHistorySchema>,
) {
  const { values: validatedValues, ...rest } =
    updateHistorySchema.parse(values);
  await db
    .insertInto("big_paint_search_history")
    .values({ ...rest, values: validatedValues })
    .onConflict((oc) => oc.column("values").doUpdateSet({ ...rest }))
    .execute();
}
