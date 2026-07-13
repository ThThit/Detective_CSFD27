CREATE TABLE "student" (
    "id"           UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    "email"        TEXT      UNIQUE NOT NULL,
    "student_id"   TEXT      UNIQUE NOT NULL,

    "role"         TEXT      NOT NULL DEFAULT 'junior' CHECK ("role" IN ('junior', 'senior', 'house_leader')),
    "is_admin"     BOOLEAN   NOT NULL DEFAULT FALSE,
    "display_name" TEXT      NOT NULL,
    "nickname"     TEXT,
    "profile_url"  TEXT,
    "house"        TEXT      NOT NULL DEFAULT 'noir' CHECK ("house" IN ('noir', 'foxlock', 'tracer', 'cipher')),
    "guess_left"   INTEGER   NOT NULL DEFAULT 3,

    "instagram"    TEXT,
    "discord"      TEXT,
    "line"         TEXT,
    "nationality"  TEXT,

    "created_at"   TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at"   TIMESTAMP NOT NULL DEFAULT NOW(),
    "deleted_at"   TIMESTAMP
);

CREATE TABLE "pcode" (
    "id"         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    "senior_id"  UUID      NOT NULL REFERENCES "student"("id"),
    "junior_id"  UUID      NOT NULL REFERENCES "student"("id"),

    UNIQUE ("senior_id", "junior_id"),

    "found_at"   TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "deleted_at" TIMESTAMP
);

CREATE TABLE "hint" (
    "id"          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    "pcode_id"    UUID      NOT NULL REFERENCES "pcode"("id") ON DELETE CASCADE,
    "content"     TEXT      NOT NULL DEFAULT '',

    "created_at"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "deleted_at"  TIMESTAMP
);

-- for debugging and visibility (must not accept write operations from application layer)
CREATE TABLE "mutation_log" (
    "id"         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    "table_name" TEXT      NOT NULL,
    "record_id"  UUID      NOT NULL,
    "operation"  TEXT      NOT NULL CHECK ("operation" IN ('INSERT', 'UPDATE', 'DELETE')),
    "old_data"   JSONB,
    "new_data"   JSONB,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- triggers functions (can ignore)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION log_mutation()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "mutation_log" ("table_name", "record_id", "operation", "old_data", "new_data")
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW."id", OLD."id"),
        TG_OP,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE to_jsonb(OLD) END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE to_jsonb(NEW) END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "student_updated_at"
BEFORE UPDATE ON "student"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "pcode_updated_at"
BEFORE UPDATE ON "pcode"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "hint_updated_at"
BEFORE UPDATE ON "hint"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER "student_mutation_log"
AFTER INSERT OR UPDATE OR DELETE ON "student"
FOR EACH ROW EXECUTE FUNCTION log_mutation();

CREATE TRIGGER "pcode_mutation_log"
AFTER INSERT OR UPDATE OR DELETE ON "pcode"
FOR EACH ROW EXECUTE FUNCTION log_mutation();

CREATE TRIGGER "hint_mutation_log"
AFTER INSERT OR UPDATE OR DELETE ON "hint"
FOR EACH ROW EXECUTE FUNCTION log_mutation();
