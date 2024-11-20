"use server";

import { db } from "@/db/db";

export default async function (offset: number, limit: number) {
  return {
    data: await db
      .selectFrom("query")
      .orderBy("date")
      .offset(offset)
      .limit(limit)
      .selectAll()
      .execute(),
    total: -1,
  };
}
