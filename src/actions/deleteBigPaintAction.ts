"use server";
import { db } from "@/db/db";

export async function deleteBigPaintAction(id: string, prevState: unknown) {
  await db.deleteFrom("big_paint").where("id", "=", id).execute();
}
