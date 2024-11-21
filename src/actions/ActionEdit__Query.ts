"use server";

import { db } from "@/db/db";
import schemaQuery__Edit from "@/schemas/schemaQuery__Edit";
import { FormValues } from "@/utils/form";

// TODO: Questo (ma non solo) non crasha quando metti un id non valido, probabilmente è per il where clause, comunque mi sa che dovrebbe crashare
export default async function (
  id: string,
  values: FormValues<typeof schemaQuery__Edit>,
) {
  const validated = schemaQuery__Edit.parse(values);
  await db
    .updateTable("query")
    .where("values", "=", id)
    .set(validated)
    .execute();
}
