import BigPaint from "@/components/big_paint/BigPaint";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { notFound } from "next/navigation";

export default async function ({ id, db }: { id: string; db: Kysely<DB> }) { // TODO: After we remove right panel bullscheisse, we can remove this injection
  // TODO: Can we combine those operations?

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
          .select(["id", "name", "date"])
          .orderBy("date")
          .execute()
      : [];

  const bigPaints = [...relatedBigPaints, bigPaint];
  bigPaints.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className="space-y-6 px-3 py-5 7xl:px-0">
      <h2 className="text-lg font-medium">Related BigPaints</h2>
      {bigPaints.length <= 0 && <p>empty</p>}
      {bigPaints.length > 0 && (
        <ul>
          {bigPaints.map((it, i) => {
            return <BigPaint key={it.id} data={it} />;
          })}
        </ul>
      )}
    </div>
  );
}
