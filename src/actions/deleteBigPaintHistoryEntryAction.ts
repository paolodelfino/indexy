"use server";

import { db } from "@/db/db";
import { idSchema } from "@/schemas/schemaId__InspirationBigPaint";
import { z } from "zod";

export default async function deleteBigPaintHistoryEntryAction(values: {
  values: string;
}) {
  const validated = z.object({ values: idSchema }).parse(values);
  await db
    .deleteFrom("big_paint_search_history")
    .where("values", "=", validated.values)
    .execute();
}
