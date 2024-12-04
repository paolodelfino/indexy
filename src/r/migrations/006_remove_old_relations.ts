import { Kysely, sql } from "kysely";
import { down as down002, up as up002 } from "./002_add_self_reference_check";

export async function up(db: Kysely<any>): Promise<void> {
  // TODO: Create indexes for fetching, searching, whatever (like GIN index on the tsvector)
  await sql`
      ALTER TABLE big_paint DROP COLUMN related_big_paints_ids;
      ALTER TABLE inspiration DROP COLUMN related_big_paints_ids;
      ALTER TABLE inspiration DROP COLUMN related_inspirations_ids;
    `.execute(db);

  await down002(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      ALTER TABLE big_paint ADD COLUMN related_big_paints_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[];
      ALTER TABLE inspiration ADD COLUMN related_big_paints_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[];
      ALTER TABLE inspiration ADD COLUMN related_inspirations_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[];
    `.execute(db);

  await up002(db);
}
