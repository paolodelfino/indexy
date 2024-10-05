"use server";
import { db } from "@/db/db";
import { notFound } from "next/navigation";

export async function fetchBigPaintAction(id: string) {
  const bigPaint = await db
    .selectFrom("big_paint")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();

  if (!bigPaint) notFound();

  const relatedBigPaints =
    bigPaint.related_big_paints_ids.length > 0
      ? await db
          .selectFrom("big_paint")
          .where("id", "in", bigPaint.related_big_paints_ids)
          .select(["id", "name"])
          .execute()
      : [];

  return {
    id: bigPaint.id,
    name: bigPaint.name,
    date: bigPaint.date,
    relatedBigPaints,
  };
}
