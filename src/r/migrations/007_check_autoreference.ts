import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
      ALTER TABLE big_paint_relations
      ADD CONSTRAINT check_big_paint_ids_different
      CHECK (big_paint1_id <> big_paint2_id);

      ALTER TABLE inspiration_relations
      ADD CONSTRAINT check_inspiration_ids_different
      CHECK (inspiration1_id <> inspiration2_id);
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      ALTER TABLE big_paint_relations
      DROP CONSTRAINT check_big_paint_ids_different;

      ALTER TABLE inspiration_relations
      DROP CONSTRAINT check_inspiration_ids_different;
    `.execute(db);
}
