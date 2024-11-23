"use server";

import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaInspiration__Create from "@/schemas/schemaInspiration__Create";
import { FormValues } from "@/utils/form";

// TODO: Extend this bullscheisse
export default async function ActionCreate__Inspiration(
  values: FormValues<typeof schemaInspiration__Create>,
) {
  const validated = schemaInspiration__Create.parse(values);

  await Promise.all(
    validated.resources.map((it) =>
      // TODO: Forse dovremmo anche salvare l'estensione
      minioClient.putObject(it.type, it.sha256, Buffer.from(it.buff)),
    ),
  );

  const resourcesIds = (
    await db
      .insertInto("resource")
      .values(
        validated.resources.map((it) => ({ sha256: it.sha256, type: it.type })),
      )
      .returning("id")
      .execute()
  ).map((it) => it.id);

  await db
    .insertInto("inspiration")
    .values({ content: validated.content, resources_ids: resourcesIds }) // TODO: Se io passo una property con il valore undefined che succede? Perché tecnicamente la key ci dovrebbe essere in questo caso rispetto allo scenario in cui non passo nulla
    .execute();
}
