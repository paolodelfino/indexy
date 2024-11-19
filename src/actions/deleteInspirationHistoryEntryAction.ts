"use server"

import { db } from "@/db/db";
import { idSchema } from "@/schemas/idSchema";
import { z } from "zod";

export default async function deleteInspirationHistoryEntryAction(values: {
  values: string;
}) {
  const validated = z.object({ values: idSchema }).parse(values);
  await db
    .deleteFrom("inspiration_search_history")
    .where("values", "=", validated.values)
    .execute();
}
