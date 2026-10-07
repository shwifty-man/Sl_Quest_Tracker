import pool from "../../DB/config/db.js"

export async function getShopItems() {
  try {
    const sql = `
      SELECT shop_items.id AS shop_item_id,
             shop_items.price,
             shop_items.active,
             items.id AS item_id,
             items.name,
             items.description,
             items.image_path,
             items.type
      FROM shop_items
      JOIN items ON items.id = shop_items.item_id
      WHERE shop_items.active = true
      ORDER BY items.name;
    `
    const results = await pool.query(sql)
    return results.rows
  } catch (err) {
    throw err
  }
}

export async function buyItem(itemId, userId) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const shopItemSql = `
      SELECT id, item_id, price, active, type
      FROM shop_items
      WHERE id = $1
      FOR UPDATE;
    `
    const shopResult = await client.query(shopItemSql, [itemId])

    const coinsSql = `
      SELECT coins
      FROM progress
      WHERE user_id = $1
      FOR UPDATE;
    `
    const userResult = await client.query(coinsSql, [userId])

    const shopRow = shopResult.rows[0]
    const userRow = userResult.rows[0]

    if (!shopRow || !shopRow.active) {
      throw new Error("Item is not available")
    }

    if (!userRow) {
      throw new Error("User progress not found")
    }

    if (userRow.coins < shopRow.price) {
      throw new Error("Not enough coins")
    }

    const updateCoinsSql = `
      UPDATE progress
      SET coins = coins - $1
      WHERE user_id = $2
      RETURNING coins;
    `
    await client.query(updateCoinsSql, [shopRow.price, userId])

    const moveToInventorySql = `
      INSERT INTO user_inventory (user_id, item_id, quantity)
      VALUES ($1, $2, 1)
      ON CONFLICT (user_id, item_id)
      DO UPDATE SET quantity = user_inventory.quantity + EXCLUDED.quantity
      RETURNING user_id, item_id, quantity;
    `
    const results = await client.query(moveToInventorySql, [userId, shopRow.item_id])
    await client.query("COMMIT")
    console.info(`Shop purchase: userId=${userId}, shopItemId=${itemId}, itemId=${shopRow.item_id}, price=${shopRow.price}`)
    return results.rows
  } catch (err) {
      await client.query("ROLLBACK")
      throw err
    } finally {
      client.release()
    }
}