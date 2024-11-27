"use server";

import { db } from "@/db/db";
import schemaBigPaint__Edit from "@/schemas/schemaBigPaint__Edit";
import { FormValues } from "@/utils/form";

// TODO: Problema della grandezza massima della richiesta
// TODO: Problema dell'esecuzione in parallelo
// TODO: There is room for improvement here
export default async function ActionEdit__BigPaint(
  id: string,
  values: FormValues<typeof schemaBigPaint__Edit>,
) {
  const { related_big_paints_ids, related_inspirations_ids, ...rest } =
    schemaBigPaint__Edit.parse(values);

  const bigPaintUpdatePromise = db
    .updateTable("big_paint")
    .where("id", "=", id)
    .set(rest)
    .execute();

  if (related_big_paints_ids !== undefined) {
    const old = await db
      .selectFrom("big_paint_relations")
      .where((eb) =>
        eb
          .or([
            eb("big_paint1_id", "in", related_big_paints_ids),
            eb("big_paint2_id", "in", related_big_paints_ids),
          ])
          .and(
            eb.or([eb("big_paint1_id", "=", id), eb("big_paint2_id", "=", id)]),
          ),
      )
      .select([
        (eb) =>
          eb
            .case()
            .when("big_paint1_id", "in", related_big_paints_ids)
            .then("big_paint1_id")
            .when("big_paint2_id", "in", related_big_paints_ids)
            .then("big_paint2_id")
            .endCase()
            .$notNull()
            .as("matched_big_paint_id"),
        "id as relation_id",
      ])
      .execute();
    const deleted = old.filter(
      (it) =>
        related_big_paints_ids.find(
          (it2) => it2 === it.matched_big_paint_id,
        ) === undefined,
    );
    const added = related_big_paints_ids.filter(
      (it) => old.find((it2) => it2.matched_big_paint_id === it) === undefined,
    );

    await Promise.all([
      db
        .deleteFrom("big_paint_relations")
        .where((eb) =>
          eb.or(deleted.map((it) => eb("id", "=", it.relation_id))),
        )
        .execute(),
      db
        .insertInto("big_paint_relations")
        .values(added.map((it) => ({ big_paint1_id: it, big_paint2_id: id })))
        .execute(),
    ]);
  }

  if (related_inspirations_ids !== undefined) {
    const old = await db
      .selectFrom("big_paint_inspiration_relations")
      .where((eb) =>
        eb.and([
          eb("inspiration_id", "in", related_inspirations_ids),
          eb("big_paint_id", "=", id),
        ]),
      )
      .select(["inspiration_id", "id as relation_id"])
      .execute();
    const deleted = old.filter(
      (it) =>
        related_inspirations_ids.find((it2) => it2 === it.inspiration_id) ===
        undefined,
    );
    const added = related_inspirations_ids.filter(
      (it) => old.find((it2) => it2.inspiration_id === it) === undefined,
    );

    await Promise.all([
      db
        .deleteFrom("big_paint_inspiration_relations")
        .where((eb) =>
          eb.or(deleted.map((it) => eb("id", "=", it.relation_id))),
        )
        .execute(),
      db
        .insertInto("big_paint_inspiration_relations")
        .values(added.map((it) => ({ inspiration_id: it, big_paint_id: id })))
        .execute(),
    ]);
  }

  await bigPaintUpdatePromise;
}
