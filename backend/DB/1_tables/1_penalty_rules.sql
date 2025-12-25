CREATE TABLE IF NOT EXISTS penalty_rules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  apps_blocked TEXT[],   -- text array of package names
  duration_type TEXT,    -- e.g., 'until_completed', 'fixed_minutes'
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
