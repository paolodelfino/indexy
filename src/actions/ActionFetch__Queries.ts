"use server";

import { db } from "@/db/db";

export default async function (offset: number, limit: number) {
  return {
    data: await db
      .selectFrom("query")
      .orderBy(["date desc", "name", "values"]) // TODO: They wouldn't probably never have the same date in real scenario, but anyway maybe I have to fix the other actions
      .offset(offset)
      .limit(limit)
      .selectAll()
      .execute(),
    total: -1,
  };
}
