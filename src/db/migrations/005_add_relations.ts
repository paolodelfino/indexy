import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // TODO: Create indexes for fetching, searching, whatever (like GIN index on the tsvector)
  // TODO: Check dell'autoreference
  await sql`
      CREATE TABLE big_paint_relations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          big_paint1_id UUID NOT NULL REFERENCES big_paint(id) ON DELETE CASCADE,
          big_paint2_id UUID NOT NULL REFERENCES big_paint(id) ON DELETE CASCADE,
          UNIQUE (big_paint1_id, big_paint2_id)
      );

      CREATE TABLE inspiration_relations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          inspiration1_id UUID NOT NULL REFERENCES inspiration(id) ON DELETE CASCADE,
          inspiration2_id UUID NOT NULL REFERENCES inspiration(id) ON DELETE CASCADE,
          UNIQUE (inspiration1_id, inspiration2_id)
      );

      CREATE TABLE big_paint_inspiration_relations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          big_paint_id UUID NOT NULL REFERENCES big_paint(id) ON DELETE CASCADE,
          inspiration_id UUID NOT NULL REFERENCES inspiration(id) ON DELETE CASCADE,
          UNIQUE (big_paint_id, inspiration_id)
      );
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      DROP TABLE big_paint_relations;
      DROP TABLE inspiration_relations;
      DROP TABLE big_paint_inspiration_relations;
    `.execute(db);
}
