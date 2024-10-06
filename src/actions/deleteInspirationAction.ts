"use server";
import { db } from "@/db/db";

export async function deleteInspirationAction(id: string, prevState: unknown) {
  await db.deleteFrom("inspiration").where("id", "=", id).execute();
}
