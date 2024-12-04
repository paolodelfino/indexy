"use server";

import { db } from "@/r/db";
import schemaResource__Exists from "@/schemas/schemaResource__Exists";
import { FormValues } from "@/utils/form";

export default async function ActionExists__Resource(
  values: FormValues<typeof schemaResource__Exists>,
) {
  const { sha256, type } = schemaResource__Exists.parse(values);
  const res = await db
    .selectFrom("resource")
    .where("sha256", "=", sha256)
    .where("type", "=", type)
    .select(["inspiration_id", "n"])
    .executeTakeFirst();
  return res;
}
