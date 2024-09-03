import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE EXTENSION "uuid-ossp";

    CREATE TABLE big_paint (
      id                      UUID        PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
      date                    TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (date <= now()),
      name                    TEXT        NOT NULL,
      related_big_paints_ids  UUID[]      NOT NULL DEFAULT ARRAY[]::UUID[]
    );
      
    CREATE TABLE inspiration (
      id                        UUID        PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
      date                      TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (date <= now()),
      highlight                 BOOLEAN     NOT NULL DEFAULT false,
      content                   TEXT        NOT NULL,
      related_big_paints_ids    UUID[]      NOT NULL DEFAULT ARRAY[]::UUID[] CHECK (array_length(related_big_paints_ids, 1) > 0),
      related_inspirations_ids  UUID[]      NOT NULL DEFAULT ARRAY[]::UUID[]
    );
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP TABLE inspiration, big_paint;

    DROP EXTENSION "uuid-ossp";
  `.execute(db);
}
