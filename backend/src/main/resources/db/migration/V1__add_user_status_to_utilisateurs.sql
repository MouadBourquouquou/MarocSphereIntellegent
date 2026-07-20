-- Add the 'status' column to the 'utilisateurs' table.
-- This column was added to the Utilisateur entity but Hibernate's ddl-auto=update
-- failed to create it due to a known bug with InheritanceType.JOINED.
-- The IF NOT EXISTS clause makes this migration idempotent (safe to re-run).

ALTER TABLE utilisateurs
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'ENABLED';
