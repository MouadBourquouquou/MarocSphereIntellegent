CREATE TABLE landmarks (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    categorie VARCHAR(255) NOT NULL,
    zone VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    categorie_prix VARCHAR(255) NOT NULL,
    prix_entree DOUBLE PRECISION NOT NULL,
    historical_period VARCHAR(255),
    unesco BOOLEAN NOT NULL DEFAULT FALSE,
    intangible_heritage VARCHAR(255),
    architectural_notes VARCHAR(255),
    description TEXT
);

CREATE INDEX idx_landmarks_zone ON landmarks(zone);
CREATE INDEX idx_landmarks_categorie ON landmarks(categorie);
CREATE UNIQUE INDEX idx_landmarks_nom_zone ON landmarks(nom, zone);
