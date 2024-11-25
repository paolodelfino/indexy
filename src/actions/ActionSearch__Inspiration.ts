"use server";

import { db } from "@/db/db";
import minioClient from "@/minio/minioClient";
import schemaInspiration__Search from "@/schemas/schemaInspiration__Search";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";
import { z } from "zod";

export default async function ActionSearch__Inspiration(
  _offset: number | null, // TODO: Remove optional
  _limit: number | null, // TODO: Remove optional
  values: FormValues<typeof schemaInspiration__Search>,
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
  } = schemaInspiration__Search.parse(values);

  let q = db.selectFrom("inspiration");

  if (date !== undefined)
    if (date.comparison === "between")
      q = q.where("date", ">=", date.date).where("date", "<=", date.date2);
    else q = q.where("date", date.comparison, date.date);

  if (highlight !== undefined) q = q.where("highlight", "=", highlight);

  if (related_big_paints_ids !== undefined)
    q = q.where(
      "related_big_paints_ids",
      "@>",
      sql<typeof related_big_paints_ids>`${related_big_paints_ids}::uuid[]`,
    );

  if (related_inspirations_ids !== undefined)
    q = q.where(
      "related_inspirations_ids",
      "@>",
      sql<typeof related_inspirations_ids>`${related_inspirations_ids}::uuid[]`,
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
    .selectAll()
    .$if(offset !== null, (qb) => qb.offset(offset!))
    .$if(limit !== null, (qb) => qb.limit(limit!))
    .execute();

  const b = await Promise.all(
    a.map(async (it) => {
      const { related_big_paints_ids, related_inspirations_ids, ...rest } = it;

      const [resources, relatedBigPaints, relatedInspirations] =
        await Promise.all([
          db
            .selectFrom("resource")
            .where("inspiration_id", "=", it.id)
            .selectAll()
            .execute(),
          db
            .selectFrom("big_paint")
            .where((eb) =>
              eb.or(it.related_big_paints_ids.map((it) => eb("id", "=", it))),
            )
            .selectAll()
            .execute(),
          db
            .selectFrom("inspiration")
            .where((eb) =>
              eb.or(it.related_inspirations_ids.map((it) => eb("id", "=", it))),
            )
            .selectAll()
            .execute(),
        ]);

      return {
        ...rest,
        resources: await Promise.all(
          resources.map(async (it) => {
            const buffer = Buffer.concat(
              await (await minioClient.getObject(it.type, it.sha256)).toArray(),
            );
            const t = buffer.buffer.slice(
              buffer.byteOffset,
              buffer.byteOffset + buffer.byteLength,
            );
            return {
              ...it,
              buff:
                t instanceof SharedArrayBuffer
                  ? new ArrayBuffer(t.byteLength)
                  : t, // TODO: Is this bullshit necessary?
            };
          }),
        ),
        relatedBigPaints,
        relatedInspirations,
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
