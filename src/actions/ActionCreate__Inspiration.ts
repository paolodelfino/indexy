"use server";

import minioClient from "@/o/db";
import { db } from "@/r/db";
import schemaInspiration__Create from "@/schemas/schemaInspiration__Create";
import { FormValues } from "@/utils/form";

export default async function ActionCreate__Inspiration(
  values: FormValues<typeof schemaInspiration__Create>,
) {
  const validated = schemaInspiration__Create.parse(values);

  const id = (
    await db
      .insertInto("inspiration")
      .values({ content: validated.content }) // TODO: Se io passo una property con il valore undefined che succede? Perché tecnicamente la key ci dovrebbe essere in questo caso rispetto allo scenario in cui non passo nulla
      .returning("id")
      .executeTakeFirstOrThrow()
  ).id;

  await Promise.all([
    validated.resources.length > 0
      ? db
          .insertInto("resource")
          .values(
            validated.resources.map((it) => ({
              sha256: it.sha256,
              type: it.type,
              n: it.n,
              inspiration_id: id,
            })),
          )
          .execute()
      : undefined,
    ...validated.resources.map((it) =>
      // TODO: Forse dovremmo anche salvare l'estensione
      minioClient.putObject(it.type, it.sha256, Buffer.from(it.buff)),
    ),
  ]);

  return id;
}
