"use server";
import { db } from "@/db/db";
import { editBigPaintSchema } from "@/schemas/editBigPaintSchema";
import { Values } from "@/stores/useEditBigPaint";

export async function editBigPaintAction(
  id: string,
  prevState: unknown,
  values: Values,
) {
  // TODO: Il fatto che ci sia ogni prop anche se col valore undefined fa lo stesso sì che venga presa in considerazione cercando di aggiornare lo stesso la riga?
  const validated = editBigPaintSchema.parse(values);
  await db
    .updateTable("big_paint")
    .where("id", "=", id)
    .set(validated)
    .execute();
}
