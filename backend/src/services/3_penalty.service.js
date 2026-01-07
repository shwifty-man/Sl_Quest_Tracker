import pool from "../../DB/0_config/db.js";

export async function getActivePenalties(penaltyId, userId) {
    try {
        const sql = `SELECT * FROM penalties WHERE id = $1 AND user_id = $2;`
        const results = await pool.query(sql, [penaltyId, userId])
        return results.rows[0]
    } catch (error) {
        throw new Error(error.message);
    }
}