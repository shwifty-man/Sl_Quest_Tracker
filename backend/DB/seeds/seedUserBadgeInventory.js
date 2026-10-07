import dotenv from "dotenv"
import pool from "./config/db.js"

dotenv.config()

async function seedUserBadgeInventory() {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    await client.query(`
      INSERT INTO user_inventory (user_id, item_id, quantity)
      SELECT u.id, i.id, d.quantity
      FROM users u
      CROSS JOIN inventory_default_items d
      JOIN items i ON i.name = d.item_name
      ON CONFLICT (user_id, item_id)
      DO UPDATE SET quantity = GREATEST(user_inventory.quantity, EXCLUDED.quantity);
    `)

    await client.query("COMMIT")
    console.log("✅ User default inventory seed completed")
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("❌ User default inventory seed failed:", err)
  } finally {
    client.release()
    await pool.end()
  }
}

seedUserBadgeInventory()
