"use server";

import { db } from "@/db/db";
import schemaQuery__Fetch from "@/schemas/schemaQuery__Fetch";
import { FormValues } from "@/utils/form";

export default async function ActionFetch__Query(
  values: FormValues<typeof schemaQuery__Fetch>,
) {
  const validated = schemaQuery__Fetch.parse(values);
  return await db
    .selectFrom("query")
    .where("values", "=", validated.values)
    .select(["name", "date"]) // TODO: Posso aggiungere il select a queste fetch actions o creare altre actions, comunque ora lascio così tanto non mi serve altro al momento
    .executeTakeFirstOrThrow();
}
