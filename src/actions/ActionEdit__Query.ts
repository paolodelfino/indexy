"use server";

import { db } from "@/db/db";
import schemaQuery__Update from "@/schemas/schemaQuery__Edit";
import { FormValues } from "@/utils/form";

export default async function (values: FormValues<typeof schemaQuery__Update>) {
  const validated = schemaQuery__Update.parse(values);
  await db
    .updateTable("query")
    .where("values", "=", validated.values)
    .set(validated)
    .execute();
}
