import UIBigPaint from "@/components/db_ui/UIBigPaint";
import { db } from "@/db/db";
import { notFound } from "next/navigation";
import { VList } from "virtua";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  // TODO: Can we combine those operations?
  // TODO: Esperimento per capire di più: col client-side routing qui, riparte il fetch anche se non cambia id?
  // TODO: Add query

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
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-grow flex-col">
        <h2 className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50">
          Related BigPaints ({bigPaints.length})
        </h2>

        <VList
          keepMounted={[bigPaints.length - 1]} // NOTE: Here we assume there we'll always be at least one entry
          className="pb-16 scrollbar-hidden"
        >
          {bigPaints.map((it, i) => {
            return <UIBigPaint key={it.id} data={it} />;
          })}
        </VList>
      </div>
    </div>
  );
}
