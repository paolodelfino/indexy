"use server";

import ActionInjectBuffer__Resource from "@/actions/ActionInjectBuffer__Resource";
import { db } from "@/db/db";
import schemaEntry__InspirationPool__Fetch from "@/schemas/schemaEntry__InspirationPool__Fetch";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";
import { z } from "zod";

// TODO: Put entry in the pool

export default async function ActionFetch__InspirationPool(
  offset: number,
  limit: number,
  values: FormValues<typeof schemaEntry__InspirationPool__Fetch>,
) {
  const { limit: validatedLimit, offset: validatedOffset } = z
    .object({ offset: z.number().gte(0), limit: z.number().gte(0) })
    .parse({ offset, limit });
  const { id, type } = schemaEntry__InspirationPool__Fetch.parse(values);

  let base;
  if (type === "inspiration")
    base = db.selectFrom((te) =>
      te
        .selectFrom("inspiration_relations as br")
        .where((eb) =>
          eb.or([
            eb("br.inspiration1_id", "=", id),
            eb("br.inspiration2_id", "=", id),
          ]),
        )
        .select((eb) =>
          eb
            .case()
            .when("br.inspiration1_id", "!=", id)
            .then(sql`br.inspiration1_id`) // TODO: Aggiusta anche dalle altre parti
            .else(sql`br.inspiration2_id`)
            .end()
            .$notNull()
            .as("inspiration_id"),
        )
        .as("r"),
    );
  else
    base = db.selectFrom((te) =>
      te
        .selectFrom("big_paint_inspiration_relations as bir")
        .where("bir.big_paint_id", "=", id)
        .select("bir.inspiration_id")
        .as("r"),
    );

  const [data, total] = await Promise.all([
    base
      .innerJoin("inspiration as i", (j) =>
        type === "inspiration"
          ? j.on((eb) =>
              eb.or([
                eb("i.id", "=", sql<string>`r.inspiration_id`),
                eb("i.id", "=", id),
              ]),
            )
          : j.onRef("i.id", "=", "r.inspiration_id"),
      )
      .distinct()
      .select(["i.content", "i.date", "i.id", "i.highlight"])
      .offset(validatedOffset)
      .limit(validatedLimit)
      .execute()
      .then(
        async (itemsWithFewerProps) =>
          await Promise.all(
            itemsWithFewerProps.map(async (it) => {
              const [
                num_related_inspirations,
                num_related_big_paints,
                resources,
              ] = await Promise.all([
                (
                  await db
                    .selectFrom("inspiration_relations as br")
                    .where((eb) =>
                      eb.or([
                        eb("br.inspiration1_id", "=", it.id),
                        eb("br.inspiration2_id", "=", it.id),
                      ]),
                    )
                    .select((eb) =>
                      eb.fn
                        .countAll()
                        .$castTo<string>()
                        .as("num_related_inspirations"),
                    )
                    .executeTakeFirstOrThrow()
                ).num_related_inspirations,

                (
                  await db
                    .selectFrom("big_paint_inspiration_relations as bir")
                    .where("bir.inspiration_id", "=", it.id)
                    .select((eb) =>
                      eb.fn
                        .countAll()
                        .$castTo<string>()
                        .as("num_related_big_paints"),
                    )
                    .executeTakeFirstOrThrow()
                ).num_related_big_paints,

                // TODO: Possible call inutile se l'array è vuoto
                ActionInjectBuffer__Resource({
                  // TODO: Should I use another action? Does it make another html request?
                  resources: await db
                    .selectFrom("resource")
                    .where("inspiration_id", "=", id)
                    .select(["type", "n", "sha256", "id"])
                    .execute(),
                }),
              ]);

              return {
                ...it,
                num_related_big_paints,
                num_related_inspirations,
                resources,
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
