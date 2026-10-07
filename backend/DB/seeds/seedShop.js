import dotenv from "dotenv";
import pool from "../config/db.js";

dotenv.config();

const effects = [
  {
    key: "xp_small_boost",
    effect_type: "xp_multiplier",
    value: 1.25,
    duration_seconds: 900,
  },
  {
    key: "xp_medium_boost",
    effect_type: "xp_multiplier",
    value: 1.5,
    duration_seconds: 1800,
  },
  {
    key: "xp_large_boost",
    effect_type: "xp_multiplier",
    value: 2,
    duration_seconds: 3600,
  },
  {
    key: "coins_small_boost",
    effect_type: "coin_multiplier",
    value: 1.25,
    duration_seconds: 900,
  },
  {
    key: "coins_medium_boost",
    effect_type: "coin_multiplier",
    value: 1.5,
    duration_seconds: 1800,
  },
  {
    key: "coins_large_boost",
    effect_type: "coin_multiplier",
    value: 2,
    duration_seconds: 3600,
  },
  {
    key: "twin_blessing_charm",
    effect_type: "xp_coin_multiplier",
    value: 1.25,
    duration_seconds: 1800,
  },
  {
    key: "quest_time_small",
    effect_type: "quest_time_extension",
    value: 15,
    duration_seconds: null,
  },
  {
    key: "quest_time_medium",
    effect_type: "quest_time_extension",
    value: 30,
    duration_seconds: null,
  },
  {
    key: "quest_time_large",
    effect_type: "quest_time_extension",
    value: 60,
    duration_seconds: null,
  },
]

const items = [
  {
    name: "Novice Insight Elixir",
    description:
      "Increases XP gains by 25% for 15 minutes.",
    image_path: "/assets/items/small_exp_potion.jpg",
    type: "multiplier",
    effect_key: "xp_small_boost",
    shop: {
      price: 100,
      active: true,
    },
  },
  {
    name: "Hunter Growth Elixir",
    description:
      "Increases XP gains by 50% for 30 minutes.",
    image_path: "/assets/items/medium_exp_potion.jpg",
    type: "multiplier",
    effect_key: "xp_medium_boost",
    shop: {
      price: 200,
      active: true,
    },
  },
  {
    name: "Monarch Ascension Elixir",
    description:
      "Doubles XP gains for 60 minutes.",
    image_path: "/assets/items/large_exp_potion.jpg",
    type: "multiplier",
    effect_key: "xp_large_boost",
    shop: {
      price: 350,
      active: true,
    },
  },
  {
    name: "Pocket Fortune Brew",
    description:
      "Increases coin gains by 25% for 15 minutes.",
    image_path: "/assets/items/small_gold_potion.jpg",
    type: "multiplier",
    effect_key: "coins_small_boost",
    shop: {
      price: 90,
      active: true,
    },
  },
  {
    name: "Treasure Seeker Brew",
    description:
      "Increases coin gains by 50% for 30 minutes.",
    image_path: "/assets/items/medium_gold_potion.jpg",
    type: "multiplier",
    effect_key: "coins_medium_boost",
    shop: {
      price: 150,
      active: true,
    },
  },
  {
    name: "Dragon Vault Brew",
    description:
      "Doubles coin gains for 60 minutes.",
    image_path: "/assets/items/large_coin_potion.jpg",
    type: "multiplier",
    effect_key: "coins_large_boost",
    shop: {
      price: 300,
      active: true,
    },
  },
  {
    name: "Twin Blessing Charm",
    description:
      "Increases both XP and coin gains by 25% for 30 minutes.",
    image_path: "/assets/items/twin_blessing_charm.jpg",
    type: "multiplier",
    effect_key: "twin_blessing_charm",
    shop: {
      price: 275,
      active: true,
    },
  },
  {
    name: "Minor Timewarp Sigil",
    description:
      "Extends all active quest deadlines by 15 minutes.",
    image_path: "/assets/items/minor_timewarp.jpg",
    type: "consumable",
    effect_key: "quest_time_small",
    shop: {
      price: 120,
      active: true,
    },
  },
  {
    name: "Greater Timewarp Sigil",
    description:
      "Extends all active quest deadlines by 30 minutes.",
    image_path: "/assets/items/greater_timewarp.jpg",
    type: "consumable",
    effect_key: "quest_time_medium",
    shop: {
      price: 220,
      active: true,
    },
  },
  {
    name: "Grand Timewarp Sigil",
    description:
      "Extends all active quest deadlines by 60 minutes.",
    image_path: "/assets/items/grand_timewarp.jpg",
    type: "consumable",
    effect_key: "quest_time_large",
    shop: {
      price: 350,
      active: true,
    },
  },
]

async function upsertEffect(client, effect) {
  const sql = `
    INSERT INTO effects (key, effect_type, value, duration_seconds)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (key)
    DO UPDATE SET effect_type = EXCLUDED.effect_type,
                  value = EXCLUDED.value,
                  duration_seconds = EXCLUDED.duration_seconds
    RETURNING id;
  `
  const result = await client.query(sql, [
    effect.key,
    effect.effect_type,
    effect.value,
    effect.duration_seconds,
  ])
  return result.rows[0].id
}

async function upsertItem(client, item, effectId) {
  const existing = await client.query(`SELECT id FROM items WHERE name = $1 LIMIT 1`, [item.name])

  if (existing.rows.length > 0) {
    const updateSql = `
      UPDATE items
      SET description = $1,
          image_path = $2,
          type = $3,
          effect_id = $4
      WHERE id = $5
      RETURNING id;
    `
    const result = await client.query(updateSql, [
      item.description,
      item.image_path,
      item.type,
      effectId,
      existing.rows[0].id,
    ])
    return result.rows[0].id
  }

  const insertSql = `
    INSERT INTO items (name, description, image_path, type, effect_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `
  const result = await client.query(insertSql, [
    item.name,
    item.description,
    item.image_path,
    item.type,
    effectId,
  ])
  return result.rows[0].id
}

async function upsertShopItem(client, itemId, shop) {
  const existing = await client.query(`SELECT id FROM shop_items WHERE item_id = $1 LIMIT 1`, [itemId])

  if (existing.rows.length > 0) {
    const updateSql = `
      UPDATE shop_items
      SET type = $1,
          price = $2,
          active = $3
      WHERE id = $4
      RETURNING id;
    `
    const result = await client.query(updateSql, [shop.type, shop.price, shop.active, existing.rows[0].id])
    return result.rows[0].id
  }

  const insertSql = `
    INSERT INTO shop_items (item_id, type, price, active)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `
  const result = await client.query(insertSql, [itemId, shop.type, shop.price, shop.active])
  return result.rows[0].id
}

async function seedShop() {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const effectIdByKey = {}
    for (const effect of effects) {
      const id = await upsertEffect(client, effect)
      effectIdByKey[effect.key] = id
    }

    const itemIdByName = {}
    for (const item of items) {
      const effectId = item.effect_key ? effectIdByKey[item.effect_key] : null
      const id = await upsertItem(client, item, effectId)
      itemIdByName[item.name] = id

      if (item.shop) {
        await upsertShopItem(client, id, {
          type: item.type,
          price: item.shop.price,
          active: item.shop.active,
        })
      }
    }

    await client.query("COMMIT")
    console.log("✅ Shop seed completed")
  } catch (err) {
    await client.query("ROLLBACK")
    console.error("❌ Shop seed failed:", err)
  } finally {
    client.release()
    await pool.end()
  }
}

seedShop()
