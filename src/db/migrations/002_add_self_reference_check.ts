import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    CREATE OR REPLACE FUNCTION check_self_reference()
    RETURNS TRIGGER AS $$
    DECLARE
        related_ids UUID[]; -- TODO: Can we
        removed_ids UUID[]; -- remove?
    BEGIN
        IF TG_TABLE_NAME = 'big_paint' THEN
            IF (NEW.related_big_paints_ids IS NOT NULL AND NEW.id = ANY(NEW.related_big_paints_ids)) THEN
                RAISE EXCEPTION 'Self-reference detected in related_big_paints_ids';
            END IF;
        END IF;

        IF TG_TABLE_NAME = 'inspiration' THEN
            IF (NEW.related_inspirations_ids IS NOT NULL AND 
                NEW.id = ANY(NEW.related_inspirations_ids)) THEN
                RAISE EXCEPTION 'Self-reference detected in related_inspirations_ids';
            END IF;
        END IF;
        
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Triggers for big_paint
    CREATE TRIGGER check_big_paint_self_reference
    BEFORE INSERT OR UPDATE ON big_paint
    FOR EACH ROW EXECUTE FUNCTION check_self_reference();

    -- Triggers for inspiration
    CREATE TRIGGER check_inspiration_self_reference
    BEFORE INSERT OR UPDATE ON inspiration
    FOR EACH ROW EXECUTE FUNCTION check_self_reference();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP TRIGGER check_big_paint_self_reference ON big_paint;
    DROP TRIGGER check_inspiration_self_reference ON inspiration;

    DROP FUNCTION check_self_reference;
  `.execute(db);
}
