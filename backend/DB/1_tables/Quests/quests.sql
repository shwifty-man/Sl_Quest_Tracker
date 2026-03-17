DROP TABLE IF EXISTS quests CASCADE;

CREATE TABLE IF NOT EXISTS quests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Workout','Study','Reading','Meditation')),
  reward JSONB NOT NULL DEFAULT '{"exp": 0, "stats": {}}'::jsonb,
  deadline TIMESTAMP WITH TIME ZONE,
  target_value INTEGER NOT NULL,
  current_value INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',      -- fixed: enum-like definition -> TEXT
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_completed BOOLEAN DEFAULT false
);
