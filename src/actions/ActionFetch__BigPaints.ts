"use server";

import { db } from "@/db/db";

export default async function ActionFetch__BigPaints(offset: number, limit: number) {
  return {
    data: await db
      .selectFrom("big_paint")
      .orderBy("date")
      .offset(offset)
      .limit(limit)
      .select(["id", "name", "date"])
      .execute(),
    total: -1,
  };
}
