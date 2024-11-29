"use server";

import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaInspiration__Delete from "@/schemas/schemaInspiration__Delete";
import { FormValues } from "@/utils/form";

export default async function ActionDelete__Inspiration(
  values: FormValues<typeof schemaInspiration__Delete>,
) {
  const validated = schemaInspiration__Delete.parse(values);

  const resources = await db
    .selectFrom("resource")
    .where("inspiration_id", "=", validated.id)
    .select(["sha256", "type"])
    .execute();

  await Promise.all([
    db.deleteFrom("inspiration").where("id", "=", validated.id).execute(),

    resources.map(
      async (it) => await minioClient.removeObject(it.type, it.sha256),
    ),
  ]);
}
