import InspirationEdit from "@/components/inspiration/InspirationEdit";
import { db } from "@/db/db";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
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
