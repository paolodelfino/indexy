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
    .object({ offset: z.number().gte(0), limit: z.number().gte(0) })
    .parse({ offset, limit });
  const { id, type } = schemaEntry__BigPaintPool__Fetch.parse(values);

  let base;
  if (type === "big_paint")
    base = db.selectFrom((te) =>
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
            .then(sql`br.big_paint1_id`)
            .else(sql`br.big_paint2_id`)
            .end()
            .$notNull()
            .as("big_paint_id"),
        )
        .as("r"),
    );
  else
    base = db.selectFrom((te) =>
      te
        .selectFrom("big_paint_inspiration_relations as bir")
        .where("bir.inspiration_id", "=", id)
        .select("bir.big_paint_id")
        .as("r"),
    );

  const [data, total] = await Promise.all([
    base
      .innerJoin("big_paint as b", (j) =>
        type === "big_paint"
          ? j.on((eb) =>
              eb.or([
                eb("b.id", "=", sql<string>`r.big_paint_id`),
                eb("b.id", "=", id),
              ]),
            )
          : j.onRef("b.id", "=", "r.big_paint_id"),
      )
      .distinct() // TODO: Tra l'altro capire perché aggiunge il big paint con id id per ogni related e controlla dall'altra parte
      .select(["b.name", "b.date", "b.id"])
      .orderBy("b.date asc")
      .offset(validatedOffset)
      .limit(validatedLimit)
      .execute()
      .then(
        async (itemsWithFewerProps) =>
          await Promise.all(
            itemsWithFewerProps.map(async (it) => {
              const [num_related_big_paints, num_related_inspirations] =
                await Promise.all([
                  (
                    await db
                      .selectFrom("big_paint_relations as br")
                      .where((eb) =>
                        eb.or([
                          eb("br.big_paint1_id", "=", it.id),
                          eb("br.big_paint2_id", "=", it.id),
                        ]),
                      )
                      .select((eb) =>
                        eb.fn
                          .countAll()
                          .$castTo<string>()
                          .as("num_related_big_paints"),
                      )
                      .executeTakeFirstOrThrow()
                  ).num_related_big_paints,

                  (
                    await db
                      .selectFrom("big_paint_inspiration_relations as bir")
                      .where("bir.big_paint_id", "=", it.id)
                      .select((eb) =>
                        eb.fn
                          .countAll()
                          .$castTo<string>()
                          .as("num_related_inspirations"),
                      )
                      .executeTakeFirstOrThrow()
                  ).num_related_inspirations,
                ]);

              return {
                ...it,
                num_related_big_paints,
                num_related_inspirations,
              };
            }),
          ),
      ),

    Number(
      (
        await base
          .select((eb) => eb.fn.countAll().as("total"))
          .executeTakeFirstOrThrow()
      ).total,
    ),
  ]);

  return { data, total };
}
