import pool from "../../DB/0_config/db.js";

// Gets active penalty for the user
export async function getActivePenalties(penaltyId, userId) {
  try {
    const sql = `SELECT active, restricted_apps, ends_at FROM penalties WHERE id = $1 AND user_id = $2 AND active = true;`
    const results = await pool.query(sql, [penaltyId, userId])
    return results.rows[0]
  } catch (error) {
    throw new Error(error.message);
  }
}

// Adds the list to restricted_apps in penalties.sql
export async function addListToRestricted(userId, ListOfApps) {
  try {
    const sql = `UPDATE penalties SET restricted_apps = $1 WHERE active = true AND user_id = $2 RETURNING active, restricted_apps, started_at, ends_at;`
    const results = await pool.query(sql, [ListOfApps, userId])
    return results.rows[0]
  } catch (error) {
    throw new Error(error.message)
  }
}