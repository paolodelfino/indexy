"use server";
import { db } from "@/db/db";
import { z } from "zod";

const schema = z.object({
  content: z.string().trim().min(1),
});

export async function createInspirationAction(
  prevState: unknown,
  formData: FormData,
) {
  const { content } = schema.parse(Object.fromEntries(formData.entries()));

  await db.insertInto("inspiration").values({ content }).execute();
}
