"use server";
import { db } from "@/db/db";
import { searchBigPaintFormSchema } from "@/schemas/searchBigPaintFormSchema";
import { FormValues } from "@/utils/form";
import { sql } from "kysely";

export async function searchBigPaintAction(
  values: FormValues<typeof searchBigPaintFormSchema>,
) {
  const {
    name,
    date,
    related_big_paints_ids,
    orderBy,
    orderByDir,
    // limit,
    // offset,
  } = searchBigPaintFormSchema.parse(values);

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

  const result = await q
    .orderBy(orderBy, orderByDir)
    .select(["id", "name", "date"])
    .execute();

  // const previousOffset = offset - limit >= 0 ? offset - limit : null;
  // const nextOffset = result.length < limit ? null : offset + result.length;

  return {
    data: result,
    // previousOffset,
    // nextOffset,
  };
}
