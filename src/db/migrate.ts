import { promises as fs } from "fs";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  NO_MIGRATIONS,
  PostgresDialect,
} from "kysely";
import { DB } from "kysely-codegen/dist/db";
import * as path from "path";
import { Pool } from "pg";

async function migrateToLatest() {
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.POSTGRES_URL_NO_SSL,
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  // const { error, results } = await migrator.migrateTo(NO_MIGRATIONS);
  // const { error, results } = await migrator.migrateDown();
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
