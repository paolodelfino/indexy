"use server";

import { db } from "@/db/db";
import schemaInspiration__Create from "@/schemas/schemaInspiration__Create";
import { FormValues } from "@/utils/form";

export default async function (
  values: FormValues<typeof schemaInspiration__Create>,
) {
  const validated = schemaInspiration__Create.parse(values);
  await db.insertInto("inspiration").values(validated).execute();
}
