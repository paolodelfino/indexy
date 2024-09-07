import BigPaintEditForm from "@/components/big_paint/BigPaintEditForm";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { notFound } from "next/navigation";

export default async function BigPaintEdit({
  id,
  db,
}: {
  id: string;
  db: Kysely<DB>;
}) {
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

  return (
    <BigPaintEditForm
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
