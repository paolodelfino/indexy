"use server";

import { db } from "@/db/db";
import schemaId__InspirationBigPaint from "@/schemas/schemaId__InspirationBigPaint";
import { z } from "zod";

export default async function deleteBigPaintHistoryEntryAction(values: {
  values: string;
}) {
  const validated = z
    .object({ values: schemaId__InspirationBigPaint })
    .parse(values);
  await db
    .deleteFrom("big_paint_search_history")
    .where("values", "=", validated.values)
    .execute();
}
