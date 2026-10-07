DROP TABLE IF EXISTS quests CASCADE;

CREATE TABLE IF NOT EXISTS quests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN ('Daily', 'Weekly', 'One-time')
    ),
    start TIMESTAMP WITH TIME ZONE NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,

    status TEXT NOT NULL DEFAULT 'pending',
    reward JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    difficulty TEXT NOT NULL DEFAULT 'Easy' CHECK (
    difficulty IN ('Easy', 'Medium', 'Hard', 'Extreme')
),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT FALSE
);