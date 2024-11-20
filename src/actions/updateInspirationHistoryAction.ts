"use server";

import { db } from "@/db/db";
import updateHistorySchema from "@/schemas/schemaQuery__Update";
import { FormValues } from "@/utils/form";

export default async function updateInspirationHistoryAction(
  values: FormValues<typeof updateHistorySchema>,
) {
  const { values: validatedValues, ...rest } =
    updateHistorySchema.parse(values);
  await db
    .insertInto("inspiration_search_history")
    .values({ ...rest, values: validatedValues })
    .onConflict((oc) => oc.column("values").doUpdateSet({ ...rest }))
    .execute();
}
