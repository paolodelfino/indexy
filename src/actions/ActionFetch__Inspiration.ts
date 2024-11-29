"use server";

import ActionInjectBuffer__Resource from "@/actions/ActionInjectBuffer__Resource";
import { db } from "@/db/db";
import schemaInspiration__Fetch from "@/schemas/schemaInspiration__Fetch";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";

export default async function ActionFetch__Inspiration(
  values: FormValues<typeof schemaInspiration__Fetch>,
) {
  const { id } = schemaInspiration__Fetch.parse(values);

  // TODO: There's probably space for improvement

  const [a, relatedInspirations, relatedBigPaints, resources] =
    await Promise.all([
      db
        .selectFrom("inspiration")
        .where("id", "=", id)
        .select(["content", "date", "highlight"])
        .executeTakeFirstOrThrow(),
      db
        .selectFrom("inspiration_relations as ir")
        .where((eb) =>
          eb.or([
            eb("ir.inspiration1_id", "=", id),
            eb("ir.inspiration2_id", "=", id),
          ]),
        )
        .innerJoin("inspiration as i", (jc) =>
          jc.on((eb) =>
            eb.or([
              eb("i.id", "=", sql<string>`"ir"."inspiration1_id"`),
              eb("i.id", "=", sql<string>`"ir"."inspiration2_id"`),
            ]),
          ),
        )
        .where("i.id", "!=", id)
        .select(["i.id", "i.content"]) // TODO: Potrei ritornare anche l'id della relazione
        .execute(),
      db
        .selectFrom("big_paint_inspiration_relations as bir")
        .where("bir.inspiration_id", "=", id)
        .innerJoin("big_paint as b", "b.id", "bir.big_paint_id")
        .select(["b.id", "b.name"]) // TODO: Potrei ritornare anche l'id della relazione
        .execute(),
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

  return { ...a, relatedBigPaints, relatedInspirations, resources };
}
