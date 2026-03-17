CREATE TABLE IF NOT EXISTS inventory_default_items (
  item_name TEXT PRIMARY KEY,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

INSERT INTO inventory_default_items (item_name, quantity)
VALUES
  ('Double XP (1 Hour)', 1),
  ('Coin Boost (30 Min)', 1)
ON CONFLICT (item_name)
DO UPDATE SET quantity = EXCLUDED.quantity;

CREATE OR REPLACE FUNCTION grant_default_inventory_to_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_inventory (user_id, item_id, quantity)
  SELECT NEW.id, i.id, d.quantity
  FROM inventory_default_items d
  JOIN items i ON i.name = d.item_name
  ON CONFLICT (user_id, item_id)
  DO UPDATE SET quantity = GREATEST(user_inventory.quantity, EXCLUDED.quantity);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_grant_default_inventory_on_user_create ON users;

CREATE TRIGGER trg_grant_default_inventory_on_user_create
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION grant_default_inventory_to_new_user();
