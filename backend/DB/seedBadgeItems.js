import dotenv from "dotenv"
import pool from "./0_config/db.js"

dotenv.config()

async function upsertBadgeItem(client, badge) {
  const existing = await client.query(
    `SELECT id FROM items WHERE badge_id = $1 LIMIT 1`,
    [badge.id]
  )

  if (existing.rows.length > 0) {
    const updateSql = `
      UPDATE items
      SET name = $1,
          description = $2,
          image_path = $3,
          type = 'badge'
      WHERE id = $4
      RETURNING id;
    `
    const result = await client.query(updateSql, [
      badge.name,
      "Badge item",
      badge.image_path,
      existing.rows[0].id,
    ])
    return result.rows[0].id
  }

  const insertSql = `
    INSERT INTO items (name, description, image_path, type, badge_id)
    VALUES ($1, $2, $3, 'badge', $4)
    RETURNING id;
  `
  const result = await client.query(insertSql, [
    badge.name,
    "Badge item",
    badge.image_path,
    badge.id,
  ])
  return result.rows[0].id
}

async function upsertShopItem(client, itemId, price) {
  const existing = await client.query(
    `SELECT id FROM shop_items WHERE item_id = $1 LIMIT 1`,
    [itemId]
  )

  if (existing.rows.length > 0) {
    const updateSql = `
      UPDATE shop_items
      SET type = 'badge',
          price = $1,
          active = true
      WHERE id = $2
      RETURNING id;
    `
    const result = await client.query(updateSql, [price || 0, existing.rows[0].id])
    return result.rows[0].id
  }

  const insertSql = `
    INSERT INTO shop_items (item_id, type, price, active)
    VALUES ($1, 'badge', $2, true)
    RETURNING id;
  `
  const result = await client.query(insertSql, [itemId, price || 0])
  return result.rows[0].id
}

async function seedBadgeItems() {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const badges = await client.query(`SELECT id, name, image_path, price FROM badges ORDER BY name`)

    for (const badge of badges.rows) {
      const itemId = await upsertBadgeItem(client, badge)
      await upsertShopItem(client, itemId, badge.price)
    }

    await client.query("COMMIT")
    console.log("✅ Badge items seeded")
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("❌ Badge items seed failed:", err)
  } finally {
    client.release()
    await pool.end()
  }
}

seedBadgeItems()
