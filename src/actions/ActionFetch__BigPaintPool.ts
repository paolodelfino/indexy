"use server";

import { db } from "@/db/db";
import schemaEntry__BigPaintPool__Fetch from "@/schemas/schemaEntry__BigPaintPool__Fetch";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";
import { z } from "zod";

export default async function ActionFetch__BigPaintPool(
  offset: number,
  limit: number,
  values: FormValues<typeof schemaEntry__BigPaintPool__Fetch>,
) {
  const { limit: validatedLimit, offset: validatedOffset } = z
    .object({ offset: z.number().gt(0), limit: z.number().gt(0) })
    .parse({ offset, limit });
  const { id, type } = schemaEntry__BigPaintPool__Fetch.parse(values);

  if (type === "big_paint") {
    const q = db
      .selectFrom((te) =>
        te
          .selectFrom("big_paint_relations as br")
          .where((eb) =>
            eb.or([
              eb("br.big_paint1_id", "=", id),
              eb("br.big_paint2_id", "=", id),
            ]),
          )
          .select((eb) =>
            eb
              .case()
              .when("br.big_paint1_id", "!=", id)
              .then("br.big_paint1_id")
              .when("br.big_paint2_id", "!=", id)
              .then("br.big_paint2_id")
              .endCase()
              .$notNull()
              .as("big_paint_id"),
          )
          .as("r"),
      )
      .innerJoin("big_paint as b", "b.id", "r.big_paint_id");

    return {
      data: await q
        .select([
          "b.name",
          "b.date",
          "b.id",
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
                eb("big_paint_relations.big_paint1_id", "=", sql<string>`"id"`),
                eb("big_paint_relations.big_paint2_id", "=", sql<string>`"id"`),
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
            .whereRef("big_paint_inspiration_relations.big_paint_id", "=", "id")
            .as("num_related_inspirations"),
        ])
        .offset(validatedOffset)
        .limit(validatedLimit)
        .execute(),
      total: Number(
        (
          await q
            .select((eb) => eb.fn.countAll().as("total"))
            .executeTakeFirstOrThrow()
        ).total,
      ),
    };
  } else {
    const q = db
      .selectFrom((te) =>
        te
          .selectFrom("big_paint_inspiration_relations as bir")
          .where("bir.inspiration_id", "=", id)
          .select("bir.big_paint_id")
          .as("r"),
      )
      .innerJoin("big_paint as b", "b.id", "r.big_paint_id");

    return {
      data: await q
        .select([
          "b.name",
          "b.date",
          "b.id",
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
                eb("big_paint_relations.big_paint1_id", "=", sql<string>`"id"`),
                eb("big_paint_relations.big_paint2_id", "=", sql<string>`"id"`),
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
            .whereRef("big_paint_inspiration_relations.big_paint_id", "=", "id")
            .as("num_related_inspirations"),
        ])
        .offset(validatedOffset)
        .limit(validatedLimit)
        .execute(),
      total: Number(
        (
          await q
            .select((eb) => eb.fn.countAll().as("total"))
            .executeTakeFirstOrThrow()
        ).total,
      ),
    };
  }
}
