"use server";

import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaInspiration__Edit from "@/schemas/schemaInspiration__Edit";
import { FormValues } from "@/utils/form";

// TODO: Problema della grandezza massima della richiesta
export default async function ActionEdit__Inspiration(
  id: string,
  values: FormValues<typeof schemaInspiration__Edit>,
) {
  const { resources, ...rest } = schemaInspiration__Edit.parse(values);

  const inspirationUpdatePromise = db
    .updateTable("inspiration")
    .where("id", "=", id)
    .set(rest)
    .execute();

  if (resources !== undefined) {
    const oldResources = await db
      .selectFrom("resource")
      .where("inspiration_id", "=", id)
      .select(["sha256", "type", "id"])
      .execute();
    const deletedResources = oldResources.filter(
      (it) =>
        resources.find(
          (it2) => it2.sha256 === it.sha256 && it2.type === it.type,
        ) === undefined,
    );
    const newResources = resources.filter(
      (it) =>
        oldResources.find(
          (it2) => it2.sha256 === it.sha256 && it2.type === it.type,
        ) === undefined,
    );

    await Promise.all([
      db
        .deleteFrom("resource")
        .where((eb) =>
          eb.or(deletedResources.map((it) => eb("id", "=", it.id))),
        )
        .execute(),
      newResources.length > 0
        ? db
            .insertInto("resource")
            .values(
              newResources.map((it) => ({
                sha256: it.sha256,
                type: it.type,
                n: it.n,
                inspiration_id: id,
              })),
            )
            .execute()
        : undefined,
      ...newResources.map((it) =>
        minioClient.putObject(it.type, it.sha256, Buffer.from(it.buff)),
      ),
    ]);
  }

  await inspirationUpdatePromise;
}
