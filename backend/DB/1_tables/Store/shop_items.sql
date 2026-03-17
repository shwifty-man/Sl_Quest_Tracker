DROP TABLE IF EXISTS shop_items CASCADE;

CREATE TABLE IF NOT EXISTS shop_items (
  id SERIAL PRIMARY KEY, 
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('consumable', 'multiplier', 'badge')),
  price INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
