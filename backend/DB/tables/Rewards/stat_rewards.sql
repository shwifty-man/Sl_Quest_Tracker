CREATE TABLE IF NOT EXISTS quest_rewards (
    id SERIAL PRIMARY KEY,

    quest_id INTEGER NOT NULL
        REFERENCES quests(id)
        ON DELETE CASCADE,

    reward_type TEXT NOT NULL CHECK (
        reward_type IN (
            'exp',
            'coins',
            'stat',
            'item',
            'badge',
            'effect'
        )
    ),

    amount INTEGER,

    stat_name TEXT CHECK (
        stat_name IN (
            'Discipline',
            'Focus',
            'Endurance',
            'Strength',
            'Recovery'
        )
    ),

    item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
    badge_id INTEGER REFERENCES badges(id) ON DELETE SET NULL,
    effect_id INTEGER REFERENCES effects(id) ON DELETE SET NULL
);