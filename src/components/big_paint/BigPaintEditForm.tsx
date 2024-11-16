import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
const BigPaintEditFormView = dynamic(
  () => import("@/components/big_paint/BigPaintEditFormView"),
);

// TODO: History (using versioning)
export default async function ({ id, db }: { id: string; db: Kysely<DB> }) {
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
    <BigPaintEditFormView
      data={{
        date: bigPaint.date,
        id: bigPaint.id,
        name: bigPaint.name,
        relatedBigPaints,
      }}
    />
  );
}
