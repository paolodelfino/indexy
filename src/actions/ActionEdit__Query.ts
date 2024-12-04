"use server";

import { db } from "@/r/db";
import schemaQuery__Edit from "@/schemas/schemaQuery__Edit";
import { FormValues } from "@/utils/form";

// TODO: Questo (ma non solo) non crasha quando metti un id non valido, probabilmente è per il where clause, comunque mi sa che dovrebbe crashare
export default async function ActionEdit__Query(
  id: string,
  values: FormValues<typeof schemaQuery__Edit>,
) {
  const validated = schemaQuery__Edit.parse(values);
  // TODO: Interessante come, nonostante esca l'errore, aggiorni lo stesso la colonna date
  // console.log(
  //   db.updateTable("query").where("values", "=", id).set(validated).compile(),
  //   await sql`SELECT now()`.execute(db),
  // );
  await db
    .updateTable("query")
    .where("values", "=", id)
    .set(validated)
    .execute();
}
