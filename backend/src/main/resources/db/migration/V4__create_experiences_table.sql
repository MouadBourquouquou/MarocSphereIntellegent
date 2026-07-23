CREATE TABLE experiences (
    id BIGSERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    localisation VARCHAR(255),
    duree VARCHAR(100),
    prix VARCHAR(100),
    categorie VARCHAR(100),
    image VARCHAR(500),
    note FLOAT DEFAULT 0,
    nombre_reservations INTEGER DEFAULT 0,
    statut VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    guide_id BIGINT NOT NULL REFERENCES guides(id),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_experiences_guide_id ON experiences(guide_id);
