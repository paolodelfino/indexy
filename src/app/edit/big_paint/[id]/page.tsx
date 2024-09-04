import BigPaintEdit from "@/components/big_paint/BigPaintEdit";
import { db } from "@/db/db";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
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
}
