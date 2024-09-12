"use server";
import { db } from "@/db/db";

export async function fetchInspirationsAction(offset: number, limit: number) {
  const inspirations = await db
    .selectFrom("inspiration")
    .orderBy("date")
    .offset(offset)
    .limit(limit)
    .select(["id", "content", "highlight", "date"])
    .execute();

  const previousOffset = offset - limit >= 0 ? offset - limit : null;
  const nextOffset =
    inspirations.length < limit ? null : offset + inspirations.length;

  return {
    data: inspirations,
    previousOffset,
    nextOffset,
  };
}
