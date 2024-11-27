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

console.log(
  db
    .selectFrom("inspiration_relations")
    .select(
      db.fn
        .coalesce(db.fn.countAll(), sql<number>`0`)
        .$castTo<string>()
        .$notNull()
        .as("num_related_inspirations"),
    )
    .whereRef("inspiration_relations.inspiration1_id", "=", "id")
    .whereRef("inspiration_relations.inspiration2_id", "=", "id")
    .compile().sql,
);

console.log(
  db
    .selectFrom("inspiration_relations")
    .select(
      db.fn
        .coalesce(db.fn.countAll(), sql<number>`0`)
        .$castTo<string>()
        .$notNull()
        .as("num_related_inspirations"),
    )
    .where("inspiration_relations.inspiration1_id", "=", "id")
    .where("inspiration_relations.inspiration2_id", "=", "id")
    .compile().sql,
);

console.log(
  db
    .selectFrom("inspiration_relations")
    .select(
      db.fn
        .coalesce(db.fn.countAll(), sql<number>`0`)
        .$castTo<string>()
        .$notNull()
        .as("num_related_inspirations"),
    )
    .where((eb) =>
      eb.or([
        eb("inspiration_relations.inspiration1_id", "=", "id"),
        eb("inspiration_relations.inspiration2_id", "=", "id"),
      ]),
    )
    .compile().sql,
);

console.log(
  db
    .selectFrom("inspiration_relations")
    .select(
      db.fn
        .coalesce(db.fn.countAll(), sql<number>`0`)
        .$castTo<string>()
        .$notNull()
        .as("num_related_inspirations"),
    )
    .where((eb) =>
      eb.or([
        eb("inspiration_relations.inspiration1_id", "=", sql<string>`"id"`),
        eb("inspiration_relations.inspiration2_id", "=", sql<string>`"id"`),
      ]),
    )
    .compile().sql,
);

console.log(
  db
    .selectFrom("inspiration_relations as ir")
    .where((eb) =>
      eb.or([
        eb("ir.inspiration1_id", "=", id),
        eb("ir.inspiration2_id", "=", id),
      ]),
    )
    .leftJoin("inspiration as i", (jc) =>
      jc.on((eb) =>
        eb.or([
          eb("i.id", "=", sql<string>`"ir"."inspiration1_id"`),
          eb("i.id", "=", sql<string>`"ir"."inspiration2_id"`),
        ]),
      ),
    )
    .where("i.id", "!=", id)
    .select(["i.id", "i.content"])
    .compile().sql,
);

await db.destroy();
