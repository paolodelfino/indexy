"use server";
import { db } from "@/db/db";
import { z } from "zod";

const schema = z.object({
  query: z.string().trim().min(1),
});

export async function searchBigPaintsAction(
  prevState: unknown,
  values: { query: string },
) {
  const { query } = schema.parse(values);

  return await db
    .selectFrom("big_paint")
    .where("name", "~*", `^${query}`)
    .select(["id", "name"])
    .execute();
}
