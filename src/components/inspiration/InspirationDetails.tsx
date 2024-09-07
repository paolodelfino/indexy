import InspirationView from "@/components/inspiration/TempInspirationView";
import { Kysely } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { notFound } from "next/navigation";

export default async function InspirationDetails({
  id,
  db,
}: {
  id: string;
  db: Kysely<DB>;
}) {
  const inspiration = await db
    .selectFrom("inspiration")
    .where("id", "=", id)
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
          .select(["id", "date", "content", "highlight"])
          .orderBy("date")
          .execute()
      : [];

  const inspirations = [...relatedInspirations, inspiration];
  inspirations.sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <>
      <div className="space-y-6 px-3 py-5 7xl:px-0">
        <h2 className="text-lg font-medium">Related BigPaints</h2>
        <ul
          className="flex flex-wrap gap-1.5"
          aria-label="List of related bigpaints"
        >
          {relatedBigPaints.map((it) => {
            return (
              <a
                href={`/${it.id}?type=big_paint`}
                role="listitem"
                key={it.id}
                title={it.name}
                className="max-w-32 overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-neutral-800 px-3 ring-1 ring-neutral-600 hover:bg-neutral-600 hover:ring-0 active:bg-neutral-700 active:ring-1"
              >
                {it.name}
              </a>
            );
          })}
        </ul>
      </div>
      <div className="space-y-6 px-3 py-5 7xl:px-0">
        <h2 className="text-lg font-medium">Related Inspirations</h2>
        <InspirationView data={inspirations} />
      </div>
    </>
  );
}
