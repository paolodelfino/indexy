"use server";

import { db } from "@/db/db";
import schemaInspiration__Delete from "@/schemas/schemaInspiration__Delete";
import { FormValues } from "@/utils/form";

export default async function ActionDelete__Inspiration(
  values: FormValues<typeof schemaInspiration__Delete>,
) {
  const validated = schemaInspiration__Delete.parse(values);
  await db.deleteFrom("inspiration").where("id", "=", validated.id).execute();
}
