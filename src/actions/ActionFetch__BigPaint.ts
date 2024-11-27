"use server";

import { db } from "@/db/db";
import schemaBigPaint__Fetch from "@/schemas/schemaBigPaint__Fetch";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";

export default async function ActionFetch__BigPaint(
  values: FormValues<typeof schemaBigPaint__Fetch>,
) {
  const { id } = schemaBigPaint__Fetch.parse(values);

  // TODO: There's probably space for improvement

  const [a, relatedBigPaints, relatedInspirations] = await Promise.all([
    db
      .selectFrom("big_paint")
      .where("id", "=", id)
      .select(["name", "date"])
      .executeTakeFirstOrThrow(),
    db
      .selectFrom("big_paint_relations as br")
      .where((eb) =>
        eb.or([
          eb("br.big_paint1_id", "=", id),
          eb("br.big_paint2_id", "=", id),
        ]),
      )
      .innerJoin("big_paint as b", (jc) =>
        jc.on((eb) =>
          eb.or([
            eb("b.id", "=", sql<string>`"br"."big_paint1_id"`),
            eb("b.id", "=", sql<string>`"br"."big_paint2_id"`),
          ]),
        ),
      )
      .where("b.id", "!=", id)
      .select(["b.id", "b.name"]) // TODO: Potrei ritornare anche l'id della relazione
      .execute(),
    db
      .selectFrom("big_paint_inspiration_relations as bir")
      .where("bir.big_paint_id", "=", id)
      .innerJoin("inspiration as i", "i.id", "bir.inspiration_id")
      .select(["i.id", "i.content"]) // TODO: Potrei ritornare anche l'id della relazione
      .execute(),
  ]);

  return { ...a, relatedBigPaints, relatedInspirations };
}
