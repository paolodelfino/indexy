"use server";

import { db } from "@/r/db";
import schemaInspiration__Query from "@/schemas/schemaInspiration__Query";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";
import { z } from "zod";

export default async function ActionQuery__Inspiration(
  _offset: number | null, // TODO: Remove optional
  _limit: number | null, // TODO: Remove optional
  values: FormValues<typeof schemaInspiration__Query>,
) {
  const offset = z.number().int().gte(0).nullable().parse(_offset); // TODO: Remove optional
  const limit = z.number().int().gte(0).nullable().parse(_limit); // TODO: Remove optional
  const {
    content,
    date,
    highlight,
    related_big_paints_ids,
    related_inspirations_ids,
    orderBy,
    orderByDir,
  } = schemaInspiration__Query.parse(values);

  let q = db.selectFrom("inspiration");

  if (date !== undefined)
    if (date.comparison === "between")
      q = q.where("date", ">=", date.date).where("date", "<=", date.date2);
    else q = q.where("date", date.comparison, date.date);

  if (highlight !== undefined) q = q.where("highlight", "=", highlight);

  if (related_big_paints_ids !== undefined)
    q = q
      .innerJoin(
        "big_paint_inspiration_relations",
        "inspiration.id",
        "big_paint_inspiration_relations.inspiration_id",
      )
      .where(
        "big_paint_inspiration_relations.big_paint_id",
        "in",
        related_big_paints_ids,
      );

  if (related_inspirations_ids !== undefined)
    q = q
      .innerJoin("inspiration_relations", (jb) =>
        jb.on((eb) =>
          eb.or([
            eb(
              "inspiration.id",
              "=",
              sql<string>`"inspiration_relations"."inspiration1_id"`,
            ),
            eb(
              "inspiration.id",
              "=",
              sql<string>`"inspiration_relations"."inspiration2_id"`,
            ),
          ]),
        ),
      )
      .where((eb) =>
        eb.or([
          eb(
            "inspiration_relations.inspiration1_id",
            "in",
            related_inspirations_ids,
          ),
          eb(
            "inspiration_relations.inspiration2_id",
            "in",
            related_inspirations_ids,
          ),
        ]),
      );

  // if (content !== undefined)
  //   if (content.mode === "CaseInsensitive")
  //     q = q.where("content", "ilike", content.x);
  //   else if (content.mode === "CaseSensitive")
  //     q = q.where("content", "like", content.x);
  //   else if (content.mode === "Regex") q = q.where("content", "~", content.x);

  if (content !== undefined) q = q.where("content", "~", content);

  const a = await q
    .orderBy(orderBy, orderByDir)
    .select([
      "inspiration.content",
      "inspiration.date",
      "inspiration.id",
      "inspiration.highlight",
      db
        .selectFrom("inspiration_relations")
        .select(
          db.fn
            .coalesce(db.fn.countAll(), sql<number>`0`)
            .$castTo<string>()
            .$notNull() // TODO: .$notNull() not working
            .as("num_related_inspirations"),
        )
        .where((eb) =>
          eb.or([
            eb(
              "inspiration_relations.inspiration1_id",
              "=",
              sql<string>`"inspiration"."id"`,
            ),
            eb(
              "inspiration_relations.inspiration2_id",
              "=",
              sql<string>`"inspiration"."id"`,
            ),
          ]),
        )
        .as("num_related_inspirations"),
      db
        .selectFrom("big_paint_inspiration_relations")
        .select(
          db.fn
            .coalesce(db.fn.countAll(), sql<number>`0`)
            .$castTo<string>()
            .$notNull()
            .as("num_related_big_paints"),
        )
        .whereRef(
          "big_paint_inspiration_relations.inspiration_id",
          "=",
          sql<string>`"inspiration"."id"`,
        )
        .as("num_related_big_paints"),
    ])
    .$if(offset !== null, (qb) => qb.offset(offset!))
    .$if(limit !== null, (qb) => qb.limit(limit!))
    .execute();

  const b = await Promise.all(
    a.map(async (it) => {
      // TODO: Can we join the previous query?
      const resources = await db
        .selectFrom("resource")
        .where("inspiration_id", "=", it.id)
        .selectAll()
        .execute();

      return {
        // TODO: Should I leave inspiration_id?
        ...it,
        resources,
        // resources: await Promise.all(
        //   resources.map(async ({ inspiration_id, ...rest }) => {
        //     const a = Buffer.concat(
        //       await (
        //         await minioClient.getObject(rest.type, rest.sha256)
        //       ).toArray(),
        //     );
        //     const b = a.buffer.slice(a.byteOffset, a.byteOffset + a.byteLength);
        //     return {
        //       ...rest,
        //       buff:
        //         b instanceof SharedArrayBuffer
        //           ? new ArrayBuffer(b.byteLength)
        //           : b, // TODO: Is this bullshit necessary?
        //     };
        //   }),
        // ),
      };
    }),
  );

  return {
    data: b,
    total: Number(
      (
        await q
          .select((eb) => eb.fn.countAll().as("total"))
          .executeTakeFirstOrThrow()
      ).total,
    ),
  };
}
