import { ButtonLink } from "@/components/Button";
import Inspiration from "@/components/inspiration/Inspiration";
import { db } from "@/db/db";
import { notFound } from "next/navigation";
import { VList } from "virtua";

export default async function InspirationDetails({ id }: { id: string }) {
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
    <div className="flex h-full flex-col space-y-6">
      <div>
        <h2 className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50">
          Related BigPaints ({relatedBigPaints.length})
        </h2>

        <ul className="flex flex-wrap gap-2">
          {relatedBigPaints.map((it) => (
            <ButtonLink
              href={`/${it.id}?type=big_paint`}
              key={it.id}
              title={it.name}
              classNames={{ button: "max-w-32" }}
            >
              {it.name}
            </ButtonLink>
          ))}
        </ul>
      </div>

      <div className="flex flex-grow flex-col">
        <h2 className="py-1 pl-4 text-lg font-medium leading-10 data-[disabled=true]:opacity-50">
          Related Inspirations ({inspirations.length})
        </h2>

        <VList
          keepMounted={[inspirations.length - 1]}
          className="pb-16 scrollbar-hidden"
        >
          {inspirations.map((it, i) => {
            return <Inspiration key={it.id} data={it} />;
          })}
        </VList>
      </div>
    </div>
  );
}
