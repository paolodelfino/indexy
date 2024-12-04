import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import { Client } from "minio";
import { promises as fs } from "node:fs";
import * as path from "path";
import { Pool } from "pg";

class Migrator {
  minioClient;
  migrationsPath;
  db;

  constructor({
    minioClient,
    migrationsPath,
    db,
  }: {
    minioClient: Client;
    db: Kysely<DB>;
    migrationsPath: string;
  }) {
    this.minioClient = minioClient;
    this.migrationsPath = migrationsPath;
    this.db = db;
  }

  async getMigrations() {
    return await this.db
      .selectFrom("minio_migration")
      .select(["name", "timestamp as executedAt"])
      .execute();
  }

  async migrateUp() {
    const executedMigrations = await this.getMigrations();
    const executedMigrationNames = executedMigrations.map((m) => m.name);

    const availableMigrations = await this.listMigrations();
    const nextMigration = availableMigrations.find(
      (migration) => !executedMigrationNames.includes(migration),
    );

    if (!nextMigration) {
      return { error: null, results: [] }; // No migrations to execute
    }

    try {
      const migrationModule = await import(
        path.join(this.migrationsPath, nextMigration)
      );
      await migrationModule.up(this.minioClient);
      await this.db
        .insertInto("minio_migration")
        .values({ name: nextMigration, timestamp: new Date().toISOString() })
        .execute();

      return {
        error: null,
        results: [{ migrationName: nextMigration, status: "Success" }],
      };
    } catch (error) {
      return {
        error,
        results: [{ migrationName: nextMigration, status: "Failed" }],
      };
    }
  }

  async migrateDown() {
    const executedMigrations = await this.getMigrations();
    if (executedMigrations.length === 0) {
      return { error: null, results: [] };
    }

    const lastMigration = executedMigrations[executedMigrations.length - 1];
    try {
      const migrationModule = await import(
        path.join(this.migrationsPath, lastMigration.name)
      );
      await migrationModule.down(this.minioClient);
      await this.db
        .deleteFrom("minio_migration")
        .where("name", "=", lastMigration.name)
        .execute();
      return {
        error: null,
        results: [{ migrationName: lastMigration.name, status: "Success" }],
      };
    } catch (error) {
      return {
        error,
        results: [{ migrationName: lastMigration.name, status: "Failed" }],
      };
    }
  }

  async listMigrations() {
    const files = await fs.readdir(this.migrationsPath);
    return files
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
      .map((file) => path.basename(file, path.extname(file)));
  }
}

function createDb() {
  return new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: Number(process.env.MINIO_PORT!),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET!,
  });
}

function createMigrator(minioClient: Client, db: Kysely<DB>) {
  return new Migrator({
    minioClient,
    db,
    migrationsPath: path.join(__dirname, "migrations"),
  });
}

async function migrateDownLast() {
  const minioClient = createDb();
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.POSTGRES_URL_NO_SSL,
      }),
    }),
  });
  const migrator = createMigrator(minioClient, db);

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
  const minioClient = createDb();
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.POSTGRES_URL_NO_SSL,
      }),
    }),
  });
  const migrator = createMigrator(minioClient, db);

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
  const minioClient = createDb();
  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.POSTGRES_URL_NO_SSL,
      }),
    }),
  });
  const migrator = createMigrator(minioClient, db);

  const executedMigrations = await migrator.getMigrations();
  const executedMigrationMap = new Map(
    executedMigrations.map((m) => [m.name, m.executedAt]),
  );

  const localMigrations = await migrator.listMigrations();

  console.log("Migrations:");
  localMigrations.forEach((migration) => {
    const executedAt = executedMigrationMap.get(migration);
    console.log(`- ${migration}: ${executedAt ? executedAt : "NOT DONE"}`);
  });

  // Log any executed migrations that are not in local files
  const orphanedMigrations = executedMigrations.filter(
    (m) => !localMigrations.includes(m.name),
  );
  if (orphanedMigrations.length) {
    console.log("\nOrphaned migrations (in DB but not found locally):");
    orphanedMigrations.forEach((migration) => {
      console.log(`- ${migration.name}: ${migration.executedAt}`);
    });
  }

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
    console.log("Usage: bun [dev|prod]__o:migrate [up|down|status]");
    process.exit(1);
}
