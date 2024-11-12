"use server";
import { db } from "@/db/db";
import { searchInspirationFormSchema } from "@/schemas/searchInspirationFormSchema";
import { FormValues } from "@/utils/form2";
import { sql } from "kysely";

export async function searchInspirationAction(
  values: FormValues<typeof searchInspirationFormSchema>,
) {
  const {
    content,
    date,
    highlight,
    related_big_paints_ids,
    related_inspirations_ids,
    orderBy,
    orderByDir,
    // limit,
    // offset,
  } = searchInspirationFormSchema.parse(values);

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

  const result = await q
    .orderBy(orderBy, orderByDir)
    .select(["id", "content", "highlight", "date"])
    .execute();

  // const previousOffset = offset - limit >= 0 ? offset - limit : null;
  // const nextOffset = result.length < limit ? null : offset + result.length;

  return {
    data: result,
    // previousOffset,
    // nextOffset,
  };
}
