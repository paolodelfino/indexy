"use server";

import { db } from "@/db/db";

export default async function (offset: number, limit: number) {
  return {
    data: await db
      .selectFrom("inspiration")
      .orderBy("date")
      .offset(offset)
      .limit(limit)
      .select(["id", "content", "highlight", "date"])
      .execute(),
    total: -1,
  };
}
