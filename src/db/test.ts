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

await db
  .insertInto("query")
  .values(
    Array.from({ length: 50 })
      .fill(0)
      .map((_, i) => ({
        values: i + "mbm",
        category: "inspiration",
        name: "test" + i,
      })),
  )
  .execute();

await db.destroy();
