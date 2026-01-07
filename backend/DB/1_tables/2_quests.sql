CREATE TABLE IF NOT EXISTS quests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exp_reward INTEGER NOT NULL DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  target_value INTEGER NOT NULL,
  current_value INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, completed, failed
  penalty_rule_id INTEGER REFERENCES penalty_rules(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_completed BOOLEAN DEFAULT false
);
