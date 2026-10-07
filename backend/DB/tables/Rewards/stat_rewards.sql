DROP TABLE IF EXISTS quest_rewards CASCADE;

CREATE TABLE quest_rewards (
    id SERIAL PRIMARY KEY,

    quest_id INTEGER NOT NULL
        UNIQUE
        REFERENCES quests(id)
        ON DELETE CASCADE,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    amount INTEGER NOT NULL,

    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);