"use server";

import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaInspiration__Create from "@/schemas/schemaInspiration__Create";
import { FormValues } from "@/utils/form";

export default async function ActionCreate__Inspiration(
  values: FormValues<typeof schemaInspiration__Create>,
) {
  const { resources, ...inspiration } = schemaInspiration__Create.parse(values);

  let resourcesIds: string[] | undefined;

  if (resources !== undefined) {
    const result = await db
      .insertInto("resource")
      .values(resources.map((it) => ({ sha256: it.sha256, type: it.type })))
      .returning("id")
      .execute();
    resourcesIds = result.map((it) => it.id);

    await Promise.all(
      resources.map((it) =>
        // TODO: Forse dovremmo anche salvare l'estensione
        minioClient.putObject(it.type, it.sha256, Buffer.from(it.buff)),
      ),
    );
  }

  await db
    .insertInto("inspiration")
    .values({ ...inspiration, resources_ids: resourcesIds }) // TODO: Se io passo una property con il valore undefined che succede? Perché tecnicamente la key ci dovrebbe essere in questo caso rispetto allo scenario in cui non passo nulla
    .execute();
}
