"use server";
import { db } from "@/db/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1),
});

export async function createBigPaintAction(
  prevState: unknown,
  formData: FormData,
) {
  const { name } = schema.parse(Object.fromEntries(formData.entries()));

  await db.insertInto("big_paint").values({ name }).execute();
}
