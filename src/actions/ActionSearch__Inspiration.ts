"use server";

import { db } from "@/db/db";
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

  return {
    data: await q
      .orderBy(orderBy, orderByDir)
      .select(["id", "content", "highlight", "date"])
      .$if(offset !== null, (qb) => qb.offset(offset!)) // TODO: Remove optional
      .$if(limit !== null, (qb) => qb.limit(limit!)) // TODO: Remove optional
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
