"use server";

import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaInspiration__Edit from "@/schemas/schemaInspiration__Edit";
import { FormValues } from "@/utils/form";

// TODO: Problema della grandezza massima della richiesta
// TODO: Problema dell'esecuzione in parallelo
// TODO: There is room for improvement here
export default async function ActionEdit__Inspiration(
  id: string,
  values: FormValues<typeof schemaInspiration__Edit>,
) {
  const {
    resources,
    related_big_paints_ids,
    related_inspirations_ids,
    ...rest
  } = schemaInspiration__Edit.parse(values);

  const inspirationUpdatePromise = db
    .updateTable("inspiration")
    .where("id", "=", id)
    .set(rest)
    .execute();

  if (related_inspirations_ids !== undefined) {
    const old = await db
      .selectFrom("inspiration_relations")
      .where((eb) =>
        eb.or([eb("inspiration1_id", "=", id), eb("inspiration2_id", "=", id)]),
      )
      .select([
        (eb) =>
          eb
            .case()
            .when("inspiration1_id", "!=", id)
            .then("inspiration1_id")
            .when("inspiration2_id", "!=", id)
            .then("inspiration2_id")
            .end()
            .$notNull()
            .as("matched_inspiration_id"),
        "id as relation_id",
      ])
      .execute();
    const deleted = old.filter(
      (it) =>
        related_inspirations_ids.find(
          (it2) => it2 === it.matched_inspiration_id,
        ) === undefined,
    );
    const added = related_inspirations_ids.filter(
      (it) =>
        old.find((it2) => it2.matched_inspiration_id === it) === undefined,
    );

    await Promise.all([
      deleted.length <= 0
        ? undefined
        : db
            .deleteFrom("inspiration_relations")
            .where((eb) =>
              eb.or(deleted.map((it) => eb("id", "=", it.relation_id))),
            )
            .execute(),
      added.length <= 0
        ? undefined
        : db
            .insertInto("inspiration_relations")
            .values(
              added.map((it) => ({ inspiration1_id: it, inspiration2_id: id })),
            )
            .execute(),
    ]);
  }

  if (related_big_paints_ids !== undefined) {
    const old = await db
      .selectFrom("big_paint_inspiration_relations")
      .where("inspiration_id", "=", id)
      .select(["big_paint_id", "id as relation_id"])
      .execute();
    const deleted = old.filter(
      (it) =>
        related_big_paints_ids.find((it2) => it2 === it.big_paint_id) ===
        undefined,
    );
    const added = related_big_paints_ids.filter(
      (it) => old.find((it2) => it2.big_paint_id === it) === undefined,
    );

    await Promise.all([
      deleted.length <= 0
        ? undefined
        : db
            .deleteFrom("big_paint_inspiration_relations")
            .where((eb) =>
              eb.or(deleted.map((it) => eb("id", "=", it.relation_id))),
            )
            .execute(),
      added.length <= 0
        ? undefined
        : db
            .insertInto("big_paint_inspiration_relations")
            .values(
              added.map((it) => ({ big_paint_id: it, inspiration_id: id })),
            )
            .execute(),
    ]);
  }

  if (resources !== undefined) {
    const old = await db
      .selectFrom("resource")
      .where("inspiration_id", "=", id)
      .select(["sha256", "type", "id"])
      .execute();
    const deleted = old.filter(
      (it) =>
        resources.find(
          (it2) => it2.sha256 === it.sha256 && it2.type === it.type,
        ) === undefined,
    );
    const added = resources.filter(
      (it) =>
        old.find((it2) => it2.sha256 === it.sha256 && it2.type === it.type) ===
        undefined,
    );

    await Promise.all([
      deleted.length <= 0
        ? undefined
        : db
            .deleteFrom("resource")
            .where((eb) => eb.or(deleted.map((it) => eb("id", "=", it.id))))
            .execute(),
      added.length > 0
        ? db
            .insertInto("resource")
            .values(
              added.map((it) => ({
                sha256: it.sha256,
                type: it.type,
                n: it.n,
                inspiration_id: id,
              })),
            )
            .execute()
        : undefined,
      ...added.map((it) =>
        minioClient.putObject(it.type, it.sha256, Buffer.from(it.buff)),
      ),
    ]);
  }

  await inspirationUpdatePromise;
}
