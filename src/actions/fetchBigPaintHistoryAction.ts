"use server";

import { db } from "@/db/db";

export default async function fetchBigPaintHistoryAction(
  offset: number,
  limit: number,
) {
  return {
    data: await db
      .selectFrom("big_paint_search_history")
      .orderBy("date")
      .offset(offset)
      .limit(limit)
      .selectAll()
      .execute(),
    total: -1,
  };
}
