//Quest Service Functions
import pool from "../../DB/0_config/db.js"

export async function getUserQuests(userId) {
  try {
    const sql = `SELECT * FROM quests WHERE user_id = $1 AND is_completed = false;`
    const results = await pool.query(sql, [userId])
    return results.rows
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function getQuestById(userId, questId) {
  try {
    const sql = `SELECT * FROM quests WHERE user_id = $1 AND id = $2`
    const results = await pool.query(sql, [userId, questId])
    return results.rows[0]
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function updateProgress(userId, questId, currentValue) {
  try {
    const sql = `UPDATE quests SET current_value = $1 WHERE id = $2 AND user_id = $3 RETURNING *;`
    const results = await pool.query(sql, [currentValue, questId, userId])
    return results.rows[0]
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function completeQuest(userId, questId) {
  try {
    const client = await pool.connect()

    await client.query("BEGIN")
    const sql = `UPDATE progress SET exp = progress.exp + quests.exp_reward FROM quests
    WHERE progress.user_id = quests.user_id AND quests.id = $1 AND quests.is_completed = false AND current_value >= target_value RETURNING *;`
    const results = await client.query(sql, [questId])

    const check = `UPDATE quests SET is_completed = true WHERE id = $1 AND current_value >= target_value AND user_id = $2;`
    const checkResults = await client.query(check, [questId, userId])

    await client.query("COMMIT")
    return results.rows[0]
  } catch (err) {
    await client.query("ROLLBACK")
    throw new Error(err.message)
  }
}

async function createDeadline() {
  try {
    const sql = `SELECT now() + interval '1 minute' AS deadline;`
    const results = await pool.query(sql)
    console.log("Deadline results: ", results.rows[0])
    return results.rows[0].deadline
  } catch (err) {
    throw new Error(err.message)
  }
}

//User / EXP Functions
function computeExp(targetValue) {
  const ranges = [
    { max: 20, exp: 10 },
    { max: 50, exp: 25 },
    { max: 100, exp: 50 },
    { max: 200, exp: 100 },
    { max: Infinity, exp: 200 },
  ]
  for (let i = 0; i < ranges.length; i++) {
    if (targetValue <= ranges[i].max) return ranges[i].exp
  }
}

// Create the Quest
export async function createQuest(
  userId,
  { questTitle, unitName, targetValue, currentValue = 0 }
) {
  // insert a new user in the DB and return the created user record
  try {
    const deadline = await createDeadline()
    const exp = computeExp(targetValue)

    //1: title, 2: deadline, 3: exp, 4: unit(the push-ups in Daily quests), 5: target, 6: the current value
    const sql = `INSERT INTO quests (user_id, title, deadline, exp_reward, unit, target_value, current_value) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`

    const results = await pool.query(sql, [
      userId,
      questTitle,
      deadline,
      exp,
      unitName,
      targetValue,
      currentValue,
    ])
    return results.rows[0]
  } catch (err) {
    throw new Error(err.message)
  }
}

/* 

{
    "questData": {"questTitle": "test1", "unitName": "unittest1", "targetValue": 100}
}


{
    "email": "user@example.com",
    "password": "password123"
}

*/