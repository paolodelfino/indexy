"use server";

import { db } from "@/db/db";
import schemaQuery__Delete from "@/schemas/schemaQuery__Delete";
import { FormValues } from "@/utils/form";

export default async function (values: FormValues<typeof schemaQuery__Delete>) {
  const validated = schemaQuery__Delete.parse(values);
  await db.deleteFrom("query").where("values", "=", validated.values).execute();
}