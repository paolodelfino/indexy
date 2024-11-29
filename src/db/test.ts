import { Kysely, PostgresDialect, sql } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { Pool } from "pg";

const time = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.POSTGRES_URL_NO_SSL,
    }),
  }),
});

const id = "13dd81ee-7383-4d7d-bec1-134a523dbfd2";

const q = db
  .selectFrom((te) =>
    te
      .selectFrom("big_paint_relations as br")
      .where((eb) =>
        eb.or([
          eb(sql`br.big_paint1_id::text`, "=", sql`${id}::text`),
          eb(sql`br.big_paint2_id::text`, "=", sql`${id}::text`),
        ]),
      )
      .select((eb) =>
        eb
          .case()
          .when(sql`br.big_paint1_id::text`, "!=", sql`${id}::text`)
          .then(sql`"br"."big_paint1_id"::text`)
          .when(sql`br.big_paint2_id::text`, "!=", sql`${id}::text`)
          .then(sql`"br"."big_paint2_id"::text`)
          .end()
          .$notNull()
          .as("big_paint_id"),
      )
      .as("r"),
  )
  .innerJoin("big_paint as b", "b.id", "r.big_paint_id");

const data = q
  .select([
    "b.name",
    "b.date",
    "b.id",
    db
      .selectFrom("big_paint_relations as br")
      .select(
        db.fn
          .coalesce(db.fn.countAll(), sql<number>`0`)
          .$castTo<string>()
          .$notNull()
          .as("num_related_big_paints"),
      )
      .where((eb) =>
        eb.or([
          eb(sql`"br"."big_paint1_id"::text`, "=", sql<string>`"b"."id"::text`),
          eb(sql`"br"."big_paint2_id"::text`, "=", sql<string>`"b"."id"::text`),
        ]),
      )
      .as("num_related_big_paints"),
    db
      .selectFrom("big_paint_inspiration_relations as bir")
      .select(
        db.fn
          .coalesce(db.fn.countAll(), sql<number>`0`)
          .$castTo<string>()
          .$notNull()
          .as("num_related_inspirations"),
      )
      .whereRef(
        sql`"bir"."big_paint_id"::text`,
        "=",
        sql<string>`"b"."id"::text`,
      )
      .as("num_related_inspirations"),
  ])
  .offset(0)
  .limit(20);

await data.execute();

await db.destroy();
