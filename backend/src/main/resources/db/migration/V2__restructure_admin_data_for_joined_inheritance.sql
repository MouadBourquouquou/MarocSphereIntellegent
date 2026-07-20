-- V2: Restructure admin_data for JOINED inheritance with Utilisateur.
-- The old admin_data table only had: id, mode_acces.
-- Now it needs an FK to utilisateurs.id.

-- If the old table exists, drop it and recreate with the correct schema.
-- This is safe because AdminData was a stub with no real data.

DROP TABLE IF EXISTS admin_data;

CREATE TABLE admin_data (
    id BIGINT PRIMARY KEY,
    mode_acces VARCHAR(100),
    CONSTRAINT fk_admin_data_utilisateur FOREIGN KEY (id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
