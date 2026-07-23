CREATE TABLE guide_conversations (
    id BIGSERIAL PRIMARY KEY,
    guide_id BIGINT NOT NULL REFERENCES guides(id),
    client_id BIGINT NOT NULL REFERENCES clients(id),
    dernier_message TEXT,
    date_dernier_message TIMESTAMP,
    messages_non_lus INTEGER DEFAULT 0,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(guide_id, client_id)
);

CREATE TABLE guide_messages (
    id BIGSERIAL PRIMARY KEY,
    contenu TEXT NOT NULL,
    role VARCHAR(10) NOT NULL,
    conversation_id BIGINT NOT NULL REFERENCES guide_conversations(id),
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guide_conv_guide_id ON guide_conversations(guide_id);
CREATE INDEX idx_guide_conv_client_id ON guide_conversations(client_id);
CREATE INDEX idx_guide_msg_conv_id ON guide_messages(conversation_id);
