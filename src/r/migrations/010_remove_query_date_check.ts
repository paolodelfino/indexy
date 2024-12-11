import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE query
    DROP CONSTRAINT query_date_check;
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE query
    ADD CONSTRAINT query_date_check CHECK (date <= now());
  `.execute(db);
}
