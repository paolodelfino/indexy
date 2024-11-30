import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // TODO: Create indexes for fetching, searching, whatever (like GIN index on the tsvector)
  await sql`
      CREATE TYPE query_category AS ENUM ('inspiration', 'big_paint');
  
      CREATE TABLE query (
        --TODO: Dato il corrente formato di values, cambierei o rimuoverei il check
        values                  TEXT            PRIMARY KEY CHECK (LENGTH(TRIM(values)) >= 3), -- TODO: Maybe readonly -- TODO: Probabilmente il conflitto deve essere relativo anche a category
        date                    TIMESTAMPTZ     NOT NULL DEFAULT now() CHECK (date <= now()), -- TODO: Maybe save all dates. TODO: Da telefono (dove ho una timezone diversa e sono avanti rispetto a quella del server in locale, quando aggiorna, fa scattare il check (controllare anche dalle altre parti))
        name                    TEXT            NOT NULL DEFAULT 'Untitled' CHECK (LENGTH(TRIM(name)) >= 1),
        category                query_category  NOT NULL
      );

      -- TODO: Non mi convince tutta questa situazione: io mi concentrerei sul far utilizzare il database correttamente invece di aggiustare gli errori

      CREATE OR REPLACE FUNCTION trim_values_before_insert()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.values := TRIM(NEW.values);
          NEW.name := TRIM(NEW.name);
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER before_query_insert
      BEFORE INSERT OR UPDATE ON query
      FOR EACH ROW
      EXECUTE FUNCTION trim_values_before_insert();
    `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
      DROP TRIGGER before_query_insert ON query;
      DROP FUNCTION trim_values_before_insert();
      DROP TABLE query;
      DROP TYPE query_category;
    `.execute(db);
}
