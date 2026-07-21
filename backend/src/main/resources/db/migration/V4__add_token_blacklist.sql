CREATE TABLE token_blacklist (
    id BIGSERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    blacklisted_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_token_blacklist_token ON token_blacklist (token);
