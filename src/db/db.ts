import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { Pool } from "pg";
import "server-only";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.POSTGRES_URL_NO_SSL,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
});
