"use server";
import { db } from "@/db/db";
import { z } from "zod";

const schema = z.object({
  query: z.string().trim().min(1),
});

export async function searchInspirationsAction(
  prevState: unknown,
  values: { query: string },
) {
  const { query } = schema.parse(values);

  return await db
    .selectFrom("inspiration")
    .where("content", "ilike", `%${query}%`)
    .select(["id", "content"])
    .execute();
}
