-- Drop ALL check constraints on the 'role' column of 'utilisateurs',
-- then add a new one that includes all current roles.

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'utilisateurs'::regclass
          AND contype = 'c'
          AND pg_get_constraintdef(oid) LIKE '%role%'
    LOOP
        EXECUTE 'ALTER TABLE utilisateurs DROP CONSTRAINT ' || quote_ident(r.conname);
    END LOOP;
END $$;

ALTER TABLE utilisateurs
    ADD CONSTRAINT utilisateurs_role_check
    CHECK (role IN ('ADMIN', 'ADMIN_DATA', 'CLIENT', 'GUIDE', 'ARTISAN', 'DMC'));
