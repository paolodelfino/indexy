"use server";

import { db } from "@/db/db";
import schemaQuery__Create from "@/schemas/schemaQuery__Create";
import { FormValues } from "@/utils/form";

export default async function ActionCreate__Query(values: FormValues<typeof schemaQuery__Create>) {
  const validated = schemaQuery__Create.parse(values);
  await db.insertInto("query").values(validated).execute();
}
