import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("minio_migration")
    .addColumn("name", "varchar(255)")
    .addPrimaryKeyConstraint("unique_name", ["name"])
    .addColumn("timestamp", "varchar(255)")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("minio_migration").execute();
}
