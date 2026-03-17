import pool from "../../DB/0_config/db.js";


// Gets active penalty for the overlay
export async function getAllActivePenalties(userId) {
  try {
    const sql = `SELECT active, quest_id, restricted_apps, ends_at FROM penalties WHERE user_id = $1 AND active = true;`
    const results = await pool.query(sql, [userId])
    return results.rows[0]
  } catch (err) {
    throw err
  }
}

// Gets active penalty for the overlay
export async function getPenaltyByQuest(questId, userId) {
  try {
    const sql = `
      SELECT id, user_id, quest_id, active, restricted_apps, started_at, ends_at
      FROM penalties
      WHERE user_id = $1 AND quest_id = $2 AND active = true;`

    const results = await pool.query(sql, [userId, questId])
    return results.rows[0]
  } catch (err) {
    throw err
  }
}

// Adds the list to restricted_apps in penalties.sql
export async function addListToRestricted(userId, ListOfApps) {
  try {
    const sql = `UPDATE penalties 
    SET restricted_apps = COALESCE(restricted_apps, '{}') || $1
    WHERE active = true AND user_id = $2
    RETURNING active, restricted_apps, started_at, ends_at;`
    const results = await pool.query(sql, [ListOfApps, userId])
    return results.rows[0]
  } catch (err) {
    throw err
  }
}