import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
      CREATE TYPE resource_type_new AS ENUM ('image', 'binary', 'video', 'audio');

      ALTER TABLE resource
        ALTER COLUMN type TYPE resource_type_new
        USING type::text::resource_type_new;

      DROP TYPE resource_type;

      ALTER TYPE resource_type_new RENAME TO resource_type;
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      UPDATE resource
      SET type = 'binary'
      WHERE type NOT IN ('image', 'binary');
  
      CREATE TYPE resource_type_new AS ENUM ('image', 'binary');

      ALTER TABLE resource
        ALTER COLUMN type TYPE resource_type_new
        USING type::text::resource_type_new;

      DROP TYPE resource_type;

      ALTER TYPE resource_type_new RENAME TO resource_type;
    `.execute(db);
}
