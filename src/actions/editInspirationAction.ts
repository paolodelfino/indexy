"use server";
import { db } from "@/db/db";
import { editInspirationSchema } from "@/schemas/editInspirationSchema";
import { Values } from "@/stores/useEditInspiration";

export async function editInspirationAction(
  id: string,
  prevState: unknown,
  values: Values,
) {
  // TODO: Il fatto che ci sia ogni prop anche se col valore undefined fa lo stesso sì che venga presa in considerazione cercando di aggiornare lo stesso la riga?
  const validated = editInspirationSchema.parse(values);
  await db
    .updateTable("inspiration")
    .where("id", "=", id)
    .set(validated)
    .execute();
}
