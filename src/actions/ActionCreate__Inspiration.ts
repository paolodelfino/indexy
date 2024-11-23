"use server";

import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaInspiration__Create from "@/schemas/schemaInspiration__Create";
import { FormValues } from "@/utils/form";

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

  const id = (
    await db
      .insertInto("inspiration")
      .values({ content: validated.content }) // TODO: Se io passo una property con il valore undefined che succede? Perché tecnicamente la key ci dovrebbe essere in questo caso rispetto allo scenario in cui non passo nulla
      .returning("id")
      .executeTakeFirstOrThrow()
  ).id;

  const resourcesIds = (
    await db
      .insertInto("resource")
      .values(
        validated.resources.map((it) => ({
          sha256: it.sha256,
          type: it.type,
          inspiration_id: id,
        })),
      )
      .returning("id")
      .execute()
  ).map((it) => it.id);

  // TODO: Probabilmente questo non è necessario dato che con l'id dell'inspiration possiamo arrivare alle risorse
  await db
    .updateTable("inspiration")
    .where("id", "=", id)
    .set({ resources_ids: resourcesIds })
    .execute();
}
