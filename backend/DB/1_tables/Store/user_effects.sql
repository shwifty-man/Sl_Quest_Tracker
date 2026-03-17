DROP TABLE IF EXISTS user_effects CASCADE;

CREATE TABLE IF NOT EXISTS user_effects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  effect_id INTEGER NOT NULL REFERENCES effects(id) ON DELETE CASCADE,
  source_item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_user_effects_user_id ON user_effects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_effects_expires_at ON user_effects(expires_at);
