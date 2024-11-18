import { db } from "@/db/db";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
const InspirationEditFormView = dynamic(
  () => import("@/app/edit/[id]/InspirationEditFormView"),
);

// TODO: History (using versioning)

export default async function InspirationEditForm({ id }: { id: string }) {
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
          .select(["id", "content"])
          .execute()
      : [];

  return (
    <InspirationEditFormView
      data={{
        id: inspiration.id,
        content: inspiration.content,
        date: inspiration.date,
        highlight: inspiration.highlight,
        relatedBigPaints,
        relatedInspirations,
      }}
    />
  );
}