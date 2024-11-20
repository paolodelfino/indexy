"use server";

import { db } from "@/db/db";
import { searchBigPaintFormSchema } from "@/schemas/schemaBigPaint__Search";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";
import { z } from "zod";

// TODO: Maybe this can become fetch
export async function searchBigPaintAction(
  _offset: number | null, // TODO: Remove optional
  _limit: number | null, // TODO: Remove optional
  values: FormValues<typeof searchBigPaintFormSchema>,
) {
  const offset = z.number().int().gte(0).nullable().parse(_offset); // TODO: Remove optional
  const limit = z.number().int().gte(0).nullable().parse(_limit); // TODO: Remove optional
  const { name, date, related_big_paints_ids, orderBy, orderByDir } =
    searchBigPaintFormSchema.parse(values);

  let q = db.selectFrom("big_paint");

  if (date !== undefined)
    if (date.comparison === "between")
      q = q.where("date", ">=", date.date).where("date", "<=", date.date2);
    else q = q.where("date", date.comparison, date.date);

  if (related_big_paints_ids !== undefined)
    q = q.where(
      "related_big_paints_ids",
      "@>",
      sql<typeof related_big_paints_ids>`${related_big_paints_ids}::uuid[]`,
    );

  if (name !== undefined) q = q.where("name", "~", name);

  return {
    data: await q
      .orderBy(orderBy, orderByDir)
      .select(["id", "name", "date"])
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
