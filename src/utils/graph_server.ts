import { db } from "@/r/db";
import schemaGraph__Fetch from "@/schemas/schemaGraph__Fetch";
import { FormValues } from "@/utils/form";
import { Link, Node } from "@/utils/graph_client";
import { sql } from "kysely";
import "server-only";

// TODO: Early return when you still got depth to explore teoretically, but practically you have no more data (when related returns nothing I guess)
export async function getGraphData({
  depth,
  id,
  type,
  show,
}: Pick<
  FormValues<typeof schemaGraph__Fetch>,
  "depth" | "id" | "type" | "show"
>): Promise<{ nodes: Node[]; links: Link[] }> {
  if (depth < 0) {
    return { nodes: [], links: [] };
  }

  const nodes: Node[] = [];
  const links: Link[] = [];

  const visitedInspirations = new Set<string>();
  const visitedBigPaints = new Set<string>();
  const linksSet = new Set<string>();

  async function traverseInspiration(id: string, currentDepth: number) {
    if (visitedInspirations.has(id)) return;

    visitedInspirations.add(id);

    const [item, resources] = await Promise.all([
      db
        .selectFrom("inspiration")
        .where("id", "=", id)
        .select([
          "inspiration.content",
          "inspiration.date",
          "inspiration.id",
          "inspiration.highlight",
          db
            .selectFrom("inspiration_relations")
            .select(
              db.fn
                .coalesce(db.fn.countAll(), sql<number>`0`)
                .$castTo<string>()
                .$notNull() // TODO: .$notNull() not working
                .as("num_related_inspirations"),
            )
            .where((eb) =>
              eb.or([
                eb(
                  "inspiration_relations.inspiration1_id",
                  "=",
                  sql<string>`"inspiration"."id"`,
                ),
                eb(
                  "inspiration_relations.inspiration2_id",
                  "=",
                  sql<string>`"inspiration"."id"`,
                ),
              ]),
            )
            .as("num_related_inspirations"),
          db
            .selectFrom("big_paint_inspiration_relations")
            .select(
              db.fn
                .coalesce(db.fn.countAll(), sql<number>`0`)
                .$castTo<string>()
                .$notNull()
                .as("num_related_big_paints"),
            )
            .whereRef(
              "big_paint_inspiration_relations.inspiration_id",
              "=",
              sql<string>`"inspiration"."id"`,
            )
            .as("num_related_big_paints"),
        ])
        .executeTakeFirstOrThrow(),

      db
        .selectFrom("resource")
        .where("inspiration_id", "=", id)
        .selectAll()
        .execute(),
    ]);

    nodes.push({
      data: { kind: "inspiration", data: { ...item, resources } },
    });

    if (currentDepth > depth) return;

    if (show === undefined || show === "inspiration_only") {
      const relatedInspirationsResult = await db
        .selectFrom("inspiration_relations")
        .where((eb) =>
          eb.or([
            eb("inspiration1_id", "=", id),
            eb("inspiration2_id", "=", id),
          ]),
        )
        .select((eb) =>
          eb
            .case()
            .when("inspiration1_id", "!=", id)
            .then(sql<string>`inspiration1_id`)
            .when("inspiration2_id", "!=", id)
            .then(sql<string>`inspiration2_id`)
            .end()
            .$notNull()
            .as("matched_inspiration_id"),
        )
        .execute();

      for (const relatedInspiration of relatedInspirationsResult) {
        const targetId = relatedInspiration.matched_inspiration_id;
        if (!linksSet.has(`e${targetId}-${id}`)) {
          linksSet.add(`e${id}-${targetId}`);
          links.push({
            source: id,
            target: targetId,
          });
          await traverseInspiration(targetId, currentDepth + 1);
        }
      }
    }

    if (show === undefined || show === "big_paint_only") {
      const relatedBigPaintsResult = await db
        .selectFrom("big_paint_inspiration_relations")
        .where("inspiration_id", "=", id)
        .select("big_paint_id")
        .execute();

      for (const relatedBigPaint of relatedBigPaintsResult) {
        const targetId = relatedBigPaint.big_paint_id;
        if (!linksSet.has(`e${targetId}-${id}`)) {
          linksSet.add(`e${id}-${targetId}`);
          links.push({
            source: id,
            target: targetId,
          });
          await traverseBigPaint(targetId, currentDepth + 1);
        }
      }
    }
  }

  async function traverseBigPaint(id: string, currentDepth: number) {
    if (visitedBigPaints.has(id)) return;

    visitedBigPaints.add(id);

    const bigPaint = await db
      .selectFrom("big_paint")
      .where("id", "=", id)
      .select([
        "big_paint.id",
        "big_paint.date",
        "big_paint.name",
        db
          .selectFrom("big_paint_relations")
          .select(
            db.fn
              .coalesce(db.fn.countAll(), sql<number>`0`)
              .$castTo<string>()
              .$notNull()
              .as("num_related_big_paints"),
          )
          .where((eb) =>
            eb.or([
              eb(
                "big_paint_relations.big_paint1_id",
                "=",
                sql<string>`"big_paint"."id"`,
              ),
              eb(
                "big_paint_relations.big_paint2_id",
                "=",
                sql<string>`"big_paint"."id"`,
              ),
            ]),
          )
          .as("num_related_big_paints"),
        db
          .selectFrom("big_paint_inspiration_relations")
          .select(
            db.fn
              .coalesce(db.fn.countAll(), sql<number>`0`)
              .$castTo<string>()
              .$notNull()
              .as("num_related_inspirations"),
          )
          .whereRef(
            "big_paint_inspiration_relations.big_paint_id",
            "=",
            sql<string>`"big_paint"."id"`,
          )
          .as("num_related_inspirations"),
      ])
      .executeTakeFirstOrThrow();

    nodes.push({
      data: { kind: "big_paint", data: bigPaint },
    });

    if (currentDepth > depth) return;

    if (show === undefined || show === "big_paint_only") {
      const relatedBigPaintsResult = await db
        .selectFrom("big_paint_relations")
        .where((eb) =>
          eb.or([eb("big_paint1_id", "=", id), eb("big_paint2_id", "=", id)]),
        )
        .select((eb) =>
          eb
            .case()
            .when("big_paint1_id", "!=", id)
            .then(sql<string>`big_paint1_id`)
            .when("big_paint2_id", "!=", id)
            .then(sql<string>`big_paint2_id`)
            .end()
            .$notNull()
            .as("matched_big_paint_id"),
        )
        .execute();

      for (const relatedBigPaint of relatedBigPaintsResult) {
        const targetId = relatedBigPaint.matched_big_paint_id;
        if (!linksSet.has(`e${targetId}-${id}`)) {
          linksSet.add(`e${id}-${targetId}`);
          links.push({
            source: id,
            target: targetId,
          });
          await traverseBigPaint(targetId, currentDepth + 1);
        }
      }
    }

    if (show === undefined || show === "inspiration_only") {
      const relatedInspirationsResult = await db
        .selectFrom("big_paint_inspiration_relations as bir")
        .where("bir.big_paint_id", "=", id)
        .select("bir.inspiration_id")
        .execute();

      for (const relatedInspiration of relatedInspirationsResult) {
        const targetId = relatedInspiration.inspiration_id;
        if (!linksSet.has(`e${targetId}-${id}`)) {
          linksSet.add(`e${id}-${targetId}`);
          links.push({
            source: id,
            target: targetId,
          });
          await traverseInspiration(targetId, currentDepth + 1);
        }
      }
    }
  }

  if (type === "big_paint") await traverseBigPaint(id, 0);
  else await traverseInspiration(id, 0);

  return { nodes, links: links };
}
