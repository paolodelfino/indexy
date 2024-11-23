import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // TODO: Create indexes for fetching, searching, whatever (like GIN index on the tsvector)
  await sql`
      CREATE TYPE resource_type AS ENUM ('image', 'binary'); --TODO: Increase number because it's one the parameters to determine resource uniqueness

      CREATE TABLE resource (
        id                      UUID          PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        sha256                  CHAR(64)      NOT NULL,
        type                    resource_type NOT NULL,
        inspiration_id          UUID          NOT NULL REFERENCES inspiration(id) ON DELETE CASCADE,
        CONSTRAINT unique_resource UNIQUE (sha256, type)
      );
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      DROP TABLE resource;
      DROP TYPE resource_type;
    `.execute(db);
}
