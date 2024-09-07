import { db } from "@/db/db";
import { notFound } from "next/navigation";
import { lazy } from "react";

const BigPaintEdit = lazy(() => import("@/components/big_paint/BigPaintEdit"));
const InspirationEdit = lazy(
  () => import("@/components/inspiration/InspirationEdit"),
);

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type =
    searchParams["type"] === "big_paint" ? "big_paint" : "inspiration";

  if (type === "big_paint") {
    const bigPaint = await db
      .selectFrom("big_paint")
      .where("id", "=", params.id)
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

    return (
      <BigPaintEdit
        data={{
          bigPaint: {
            name: bigPaint.name,
            date: bigPaint.date,
            id: bigPaint.id,
          },
          relatedBigPaints,
        }}
      />
    );
  } else {
    const inspiration = await db
      .selectFrom("inspiration")
      .where("id", "=", params.id)
      .selectAll()
      .executeTakeFirst();

    if (!inspiration) notFound();

    const relatedBigPaints =
      inspiration.related_big_paints_ids.length > 0
        ? await db
            .selectFrom("big_paint")
            .where("id", "in", inspiration.related_big_paints_ids)
            .select(["id", "name"])
            .execute()
        : [];

    const relatedInspirations =
      inspiration.related_inspirations_ids.length > 0
        ? await db
            .selectFrom("inspiration")
            .where("id", "in", inspiration.related_inspirations_ids)
            .select(["id", "content as name"])
            .execute()
        : [];

    return (
      <InspirationEdit
        data={{
          inspiration: {
            content: inspiration.content,
            date: inspiration.date,
            highlight: inspiration.highlight,
            id: inspiration.id,
          },
          relatedBigPaints,
          relatedInspirations,
        }}
      />
    );
  }
}
