"use server";
import { db } from "@/db/db";

export async function fetchBigPaintsAction(offset: number, limit: number) {
  const bigPaint = await db
    .selectFrom("big_paint")
    .orderBy("date")
    .offset(offset)
    .limit(limit)
    .select(["id", "name", "date"])
    .execute();

  const previousOffset = offset - limit >= 0 ? offset - limit : null;
  const nextOffset = bigPaint.length < limit ? null : offset + bigPaint.length;

  return {
    data: bigPaint,
    previousOffset,
    nextOffset,
  };
}
