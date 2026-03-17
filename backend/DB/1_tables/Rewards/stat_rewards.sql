DROP TABLE IF EXISTS stat_rewards CASCADE;

CREATE TABLE IF NOT EXISTS stat_rewards (
    id SERIAL PRIMARY KEY,
    quest_id INTEGER NOT NULL REFERENCES quests(id) ON DELETE CASCADE,
    stat_name TEXT NOT NULL CHECK (stat_name IN ('Discipline','Focus','Endurance','Strength','Recovery')),
    value INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
