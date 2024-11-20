import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // TODO: Create indexes for fetching, searching, whatever (like GIN index on the tsvector)
  await sql`
      CREATE TABLE inspiration_search_history (
        values                  TEXT        PRIMARY KEY CHECK (LENGTH(TRIM(values)) >= 3), -- TODO: Maybe readonly
        date                    TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (date <= now()), -- TODO: Maybe save all dates
        name                    TEXT        NOT NULL DEFAULT 'Untitled' CHECK (LENGTH(TRIM(name)) >= 1)
      );

      CREATE TABLE big_paint_search_history (
        values                  TEXT        PRIMARY KEY CHECK (LENGTH(TRIM(values)) >= 3), -- TODO: Maybe readonly
        date                    TIMESTAMPTZ NOT NULL DEFAULT now() CHECK (date <= now()), -- TODO: Maybe save all dates
        name                    TEXT        NOT NULL DEFAULT 'Untitled' CHECK (LENGTH(TRIM(name)) >= 1)
      );

      CREATE OR REPLACE FUNCTION trim_values_before_insert()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.values := TRIM(NEW.values);
          NEW.name := TRIM(NEW.name);
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER before_inspiration_insert
      BEFORE INSERT OR UPDATE ON inspiration_search_history
      FOR EACH ROW
      EXECUTE FUNCTION trim_values_before_insert();

      CREATE TRIGGER before_big_paint_insert
      BEFORE INSERT OR UPDATE ON big_paint_search_history
      FOR EACH ROW
      EXECUTE FUNCTION trim_values_before_insert();
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      DROP TRIGGER before_inspiration_insert ON inspiration_search_history;
      DROP TRIGGER before_big_paint_insert ON big_paint_search_history;
      DROP FUNCTION trim_values_before_insert();
      DROP TABLE inspiration_search_history;
      DROP TABLE big_paint_search_history;
    `.execute(db);
}
