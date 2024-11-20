import { Kysely, PostgresDialect } from "kysely";
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
  "delete",
  await db.deleteFrom("inspiration_search_history").execute(),
);

console.log(
  "history",
  await db.selectFrom("inspiration_search_history").selectAll().execute(),
);

console.log(
  "insert",
  await db
    .insertInto("inspiration_search_history")
    .values([
      { values: "    al2   " },
      { name: "   2    ", values: "hiòf" },
      { name: "hi2", values: "bye" },
      { values: "bye2",  },
    ])
    .execute(),
);

console.log(
  "history",
  await db.selectFrom("inspiration_search_history").selectAll().execute(),
);

// await time(2256);

// console.log(
//   "insert",
//   await db
//     .insertInto("inspiration_search_history")
//     .values([{ values: "hello" }])
//     .onConflict((oc) => oc.column("values").doUpdateSet({ date: sql`now()` }))
//     .execute(),
// );

// console.log(
//   "history",
//   await db.selectFrom("inspiration_search_history").selectAll().execute(),
// );

await db.destroy();
