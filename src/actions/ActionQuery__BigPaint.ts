"use server";

import { db } from "@/r/db";
import schemaBigPaint__Query from "@/schemas/schemaBigPaint__Query";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";
import { z } from "zod";

// TODO: Maybe this can become fetch
export default async function ActionQuery__BigPaint(
  _offset: number | null, // TODO: Remove optional
  _limit: number | null, // TODO: Remove optional
  values: FormValues<typeof schemaBigPaint__Query>,
) {
  const offset = z.number().int().gte(0).nullable().parse(_offset); // TODO: Remove optional
  const limit = z.number().int().gte(0).nullable().parse(_limit); // TODO: Remove optional
  const {
    name,
    date,
    related_big_paints_ids,
    related_inspirations_ids,
    orderBy,
    orderByDir,
  } = schemaBigPaint__Query.parse(values);

  let q = db.selectFrom("big_paint");

  if (date !== undefined)
    if (date.comparison === "between")
      q = q.where("date", ">=", date.date).where("date", "<=", date.date2);
    else q = q.where("date", date.comparison, date.date);

  if (related_big_paints_ids !== undefined)
    q = q
      .innerJoin("big_paint_relations", (jb) =>
        jb.on((eb) =>
          eb.or([
            eb(
              "big_paint.id",
              "=",
              sql<string>`"big_paint_relations"."big_paint1_id"`,
            ),
            eb(
              "big_paint.id",
              "=",
              sql<string>`"big_paint_relations"."big_paint2_id"`,
            ),
          ]),
        ),
      )
      .where((eb) =>
        eb.or([
          eb("big_paint_relations.big_paint1_id", "in", related_big_paints_ids),
          eb("big_paint_relations.big_paint2_id", "in", related_big_paints_ids),
        ]),
      );

  if (related_inspirations_ids !== undefined)
    q = q
      .innerJoin(
        "big_paint_inspiration_relations",
        "big_paint.id",
        "big_paint_inspiration_relations.big_paint_id",
      )
      .where(
        "big_paint_inspiration_relations.inspiration_id",
        "in",
        related_inspirations_ids,
      );

  if (name !== undefined) q = q.where("name", "~", name);

  return {
    data: await q
      .orderBy(orderBy, orderByDir)
      .select([
        "id",
        "date",
        "name",
        db
          .selectFrom("big_paint_relations")
          .select(
            db.fn
              .coalesce(db.fn.countAll(), sql<number>`0`)
              .$castTo<string>()
              .$notNull()
              .as("num_related_big_paints"),
          )
          .where((eb) =>
            eb.or([
              eb(
                "big_paint_relations.big_paint1_id",
                "=",
                sql<string>`"big_paint"."id"`,
              ),
              eb(
                "big_paint_relations.big_paint2_id",
                "=",
                sql<string>`"big_paint"."id"`,
              ),
            ]),
          )
          .as("num_related_big_paints"),
        db
          .selectFrom("big_paint_inspiration_relations")
          .select(
            db.fn
              .coalesce(db.fn.countAll(), sql<number>`0`)
              .$castTo<string>()
              .$notNull()
              .as("num_related_inspirations"),
          )
          .whereRef(
            "big_paint_inspiration_relations.big_paint_id",
            "=",
            sql<string>`"big_paint"."id"`,
          )
          .as("num_related_inspirations"),
      ])
      .$if(offset !== null, (qb) => qb.offset(offset!)) // TODO: Remove optional
      .$if(limit !== null, (qb) => qb.limit(limit!)) // TODO: Remove optional
      .execute(),
    total: Number(
      // TODO: Convert to string
      (
        await q
          .select((eb) => eb.fn.countAll().as("total"))
          .executeTakeFirstOrThrow()
      ).total,
    ),
  };
}
