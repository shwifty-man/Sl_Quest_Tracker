import pool from "../../DB/config/db.js"

export async function changeHunterName(name, userId) {
  try {
    const updateSql = `UPDATE users SET username = $1 WHERE id = $2 RETURNING username;`
    const updateResult = await pool.query(updateSql, [name, userId])

    if (updateResult.rows.length > 0) {
      return updateResult.rows[0]
    }

    const insertSql = `INSERT INTO users (id, username) VALUES ($2, $1) RETURNING username;`
    const insertResult = await pool.query(insertSql, [name, userId])
    return insertResult.rows[0]
  } catch (err) {
    throw err
  }
}

export async function changeSetup(userId) {
  try {
    const results = await pool.query(`UPDATE users SET setup_complete = TRUE WHERE id = $1 RETURNING setup_complete;`, [userId])
    return results.rows[0]
  } catch (err) {
    throw err
  }
}

export async function getHunterName(userId) {
  try {
    const sql = `SELECT username FROM users WHERE id = $1;`
    const result = await pool.query(sql, [userId])
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export async function getUserStats(userId) {
  try {
    const sql = `SELECT * FROM user_stats WHERE user_id = $1;`
    const result = await pool.query(sql, [userId])

    const sqlStreak = `SELECT id, user_id, 
    CASE
      WHEN last_completed_at::date >= CURRENT_DATE - 1
        THEN current_streak
      ELSE 0
    END AS current_streak, longest_streak, last_completed_at
  FROM streaks
  WHERE user_id = $1;`
    const resultStreak = await pool.query(sqlStreak, [userId])

    const sqlWeekly = `SELECT TO_CHAR(days.day, 'Dy') AS day, COUNT(quests.id) AS completed
    FROM generate_series(
      date_trunc('week', CURRENT_DATE),
      date_trunc('week', CURRENT_DATE) + INTERVAL '6 days',
      INTERVAL '1 day'
    ) AS days(day)
    LEFT JOIN quests
      ON DATE(quests.completed_at) = days.day
      AND quests.user_id = $1
      AND quests.is_completed = TRUE
    GROUP BY days.day
    ORDER BY days.day;`

    const resultWeekly = await pool.query(sqlWeekly, [userId])

    const streak = resultStreak.rows[0]
    const weekly = resultWeekly.rows

    console.log("Streak!: ", streak)
    console.log("Weekly!: ", weekly)

    return {
      stats: result.rows[0],
      streak,
      weekly

    }
  } catch (err) {
    throw err
  }
}

export async function updateUserStats(userId, stats) {
  try {
    const sql = `UPDATE user_stats SET focus = $1 WHERE user_id = $2 RETURNING focus;`
    const result = await pool.query(sql, [stats.focus, userId])
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export async function getUserProgress(userId) {
  try {
    const sql = `SELECT * FROM progress WHERE user_id = $1;`
    const result = await pool.query(sql, [userId])
    return result.rows[0]
  } catch (err) {
    throw err
  }
}

export async function getUserInventory(userId) {
  try {
    const sql = `
      SELECT items.id AS item_id,
             items.name,
             items.description,
             items.image_path,
             items.type,
             items.effect_id,
              items.badge_id,
             user_inventory.quantity,
             user_inventory.acquired_at
      FROM user_inventory
      JOIN items ON items.id = user_inventory.item_id
      WHERE user_inventory.user_id = $1
      ORDER BY items.name;`
    const results = await pool.query(sql, [userId])
    return results.rows
  } catch (err) {
    throw err
  }
}

export async function useInventoryItem(userId, itemId) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const inventorySql = `
      SELECT ui.quantity,
             i.id AS item_id,
            i.type,
             i.effect_id,
            i.badge_id,
             e.effect_type,
             e.value,
             e.duration_seconds
      FROM user_inventory ui
      JOIN items i ON i.id = ui.item_id
      LEFT JOIN effects e ON e.id = i.effect_id
      WHERE ui.user_id = $1 AND ui.item_id = $2
            FOR UPDATE OF ui;
    `
    const inventoryResult = await client.query(inventorySql, [userId, itemId])
    const row = inventoryResult.rows[0]

    if (!row || row.quantity <= 0) {
      throw new Error("Item not available in inventory")
    }

    let newQuantity = row.quantity
    if (row.type !== "badge") {
      newQuantity = row.quantity - 1
      if (newQuantity === 0) {
        await client.query(`DELETE FROM user_inventory WHERE user_id = $1 AND item_id = $2`, [userId, itemId])
      } else {
        await client.query(
          `UPDATE user_inventory SET quantity = $1 WHERE user_id = $2 AND item_id = $3`,
          [newQuantity, userId, itemId]
        )
      }
    }

    let appliedEffect = null
    if (row.effect_id && row.effect_type === "quest_time_extension") {
      const extensionMinutes = Number(row.value || 0)
      if (!Number.isFinite(extensionMinutes) || extensionMinutes <= 0) {
        throw new Error("Invalid quest time extension value")
      }

      const extendSql = `
        UPDATE quests
        SET deadline = deadline + ($2 * interval '1 minute')
        WHERE user_id = $1
          AND is_completed = false
          AND status = 'pending'
          AND deadline IS NOT NULL
          AND deadline > now()
        RETURNING id, deadline;
      `
      const extended = await client.query(extendSql, [userId, extensionMinutes])
      if (extended.rows.length === 0) {
        throw new Error("No active quests available to extend")
      }

      appliedEffect = {
        effect_type: row.effect_type,
        value: extensionMinutes,
        extendedQuests: extended.rows.length,
      }
    } else if (row.effect_id) {
      const expiresAt = row.duration_seconds
        ? new Date(Date.now() + row.duration_seconds * 1000)
        : null

      const insertEffectSql = `
        INSERT INTO user_effects (
            user_id,
            effect_id,
            source_item_id,
            expires_at
        )
        SELECT $1, $2, $3, $4
        WHERE NOT EXISTS (
            SELECT 1
            FROM user_effects ue
            JOIN effects e ON e.id = ue.effect_id
            WHERE ue.user_id = $1
              AND e.effect_type = (
                  SELECT effect_type
                  FROM effects
                  WHERE id = $2
              )
              AND (ue.expires_at IS NULL OR ue.expires_at > now())
        )
        RETURNING id, effect_id, expires_at;
    `;

      const effectResult = await client.query(insertEffectSql, [userId, row.effect_id, itemId, expiresAt])

      if (effectResult.rows.length === 0) {
        throw new Error(`A ${row.effect_type} effect is already active`)
      }

      appliedEffect = {
        ...effectResult.rows[0],
        effect_type: row.effect_type,
        value: row.value,
        duration_seconds: row.duration_seconds,
      }
    }

    if (row.type === "badge" && row.badge_id) {
      const badgeSql = `
        INSERT INTO user_badges (user_id, badge_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET badge_id = EXCLUDED.badge_id
        RETURNING user_id, badge_id;
      `
      await client.query(badgeSql, [userId, row.badge_id])
    }

    await client.query("COMMIT")
    return { appliedEffect, remainingQuantity: newQuantity }
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

export async function getActiveEffects(userId) {

  const client = await pool.connect()

  try {

    const sql = `
      SELECT
        ue.id,
        ue.effect_id,
        ue.source_item_id,
        ue.expires_at,
        e.effect_type,
        e.value,
        e.duration_seconds
      FROM user_effects ue
      JOIN effects e ON e.id = ue.effect_id
      WHERE ue.user_id = $1
        AND (ue.expires_at IS NULL OR ue.expires_at > now())
      ORDER BY ue.expires_at ASC NULLS LAST;
    `

    const result = await client.query(sql, [userId])

    return result.rows

  } finally {

    client.release()

  }

}