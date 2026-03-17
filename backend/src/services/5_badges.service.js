import pool from "../../DB/0_config/db.js"

export async function updateBadge(badgeId, userId) {
  try {
    const sql = `
      INSERT INTO user_badges (user_id, badge_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id)
      DO UPDATE SET badge_id = EXCLUDED.badge_id
      RETURNING user_id, badge_id;`
    const results = await pool.query(sql, [userId, badgeId])
    return results.rows[0]
  } catch (err) {
    throw err
  }
}


export async function getBadges() {
  try {
    const sql = `SELECT id, name, image_path, price FROM badges ORDER BY name;`
    const results = await pool.query(sql)
    return results.rows
  } catch (err) {
    throw err
  }
}

export async function getUserBadge(userId) {
  try {
    const sql = `SELECT badges.id, badges.name, badges.image_path
    FROM user_badges
    LEFT JOIN badges ON badges.id = user_badges.badge_id
    WHERE user_badges.user_id = $1;`
    const results = await pool.query(sql, [userId])
    return results.rows[0]
  } catch (err) {
    throw err
  }
}