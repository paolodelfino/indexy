"use server";

import { db } from "@/db/db";
import schemaInspiration__Edit from "@/schemas/schemaInspiration__Edit";
import { FormValues } from "@/utils/form";

export default async function ActionEdit__Inspiration(
  id: string,
  values: FormValues<typeof schemaInspiration__Edit>,
) {
  const validated = schemaInspiration__Edit.parse(values);
  await db
    .updateTable("inspiration")
    .where("id", "=", id)
    .set(validated)
    .execute();
}
