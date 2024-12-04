import { dateToString } from "@/utils/date";
import { promises as fs } from "fs";
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from "kysely";
import { DB } from "kysely-codegen/dist/db";
import * as path from "path";
import { Pool } from "pg";

function createDb() {
  return new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.POSTGRES_URL_NO_SSL,
      }),
    }),
  });
}

function createMigrator(db: Kysely<DB>) {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });
}

async function migrateDownLast() {
  const db = createDb();
  const migrator = createMigrator(db);

  const { error, results } = await migrator.migrateDown();

  if (results?.length) {
    const lastResult = results[results.length - 1];
    if (lastResult.status === "Success") {
      console.log(
        `migration "${lastResult.migrationName}" was rolled back successfully`,
      );
    } else {
      console.error(
        `failed to roll back migration "${lastResult.migrationName}"`,
      );
    }
  } else {
    console.log("No migrations to roll back.");
  }

  if (error) {
    console.error("failed to roll back migration");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

async function migrateUpLast() {
  const db = createDb();
  const migrator = createMigrator(db);

  const { error, results } = await migrator.migrateUp();

  if (results?.length) {
    const lastResult = results[results.length - 1];
    if (lastResult.status === "Success") {
      console.log(
        `migration "${lastResult.migrationName}" was executed successfully`,
      );
    } else {
      console.error(
        `failed to execute migration "${lastResult.migrationName}"`,
      );
    }
  } else {
    console.log("No migrations to execute.");
  }

  if (error) {
    console.error("failed to migrate up");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

async function displayMigrations() {
  const db = createDb();
  const migrator = createMigrator(db);

  const results = await migrator.getMigrations();

  console.log("Migrations:");
  results.forEach((migration) => {
    console.log(
      `- ${migration.name}: ${migration.executedAt !== undefined ? dateToString(migration.executedAt) : "NOT DONE"}`,
    );
  });

  await db.destroy();
}

const command = process.argv[2];

switch (command) {
  case "down":
    migrateDownLast();
    break;
  case "up":
    migrateUpLast();
    break;
  case "status":
    displayMigrations();
    break;
  default:
    console.log("Usage: bun [dev|prod]__r:migrate [up|down|status]");
    process.exit(1);
}
