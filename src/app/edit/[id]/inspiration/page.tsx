import { db } from "@/db/db";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
const FormEdit__Inspiration = dynamic(
  () => import("@/components/forms/FormEdit__Inspiration"),
);

// TODO: History (using versioning)

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const inspiration = await db
    .selectFrom("inspiration")
    .where("inspiration.id", "=", id)
    .leftJoin("resource", "inspiration.id", "resource.inspiration_id")
    .selectAll("inspiration")
    .select((eb) => eb.fn.jsonAgg("resource").as("resources")) // TODO: Select only necessary
    .groupBy("inspiration.id") // Necessary when using aggregation
    .executeTakeFirst();

  // console.log(inspiration);

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
    <FormEdit__Inspiration
      data={{
        id: inspiration.id,
        content: inspiration.content,
        date: inspiration.date,
        highlight: inspiration.highlight,
        resources: inspiration.resources.filter(Boolean).map((it) => ({
          // TODO: Questione null item
          sha256: it.sha256!,
          type: it.type!,
          n: it.n!,
        })),
        relatedBigPaints,
        relatedInspirations,
      }}
    />
  );
}
