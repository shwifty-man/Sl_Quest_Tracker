//Quest Service Functions
import pool from "../../DB/0_config/db.js"
import { computeExp, createDeadline, expToNextLevel } from "../utils/questHelper.js"

async function getActiveMultiplier(client, userId, effectType) {
  const sql = `
    SELECT COALESCE(MAX(e.value), 1) AS multiplier
    FROM user_effects ue
    JOIN effects e ON e.id = ue.effect_id
    WHERE ue.user_id = $1
      AND ue.active = true
      AND (e.effect_type = $2 OR e.effect_type = 'xp_coin_multiplier')
      AND (ue.expires_at IS NULL OR ue.expires_at > now());
  `
  const result = await client.query(sql, [userId, effectType])
  return Number(result.rows[0]?.multiplier ?? 1)
}

export async function getUserQuests(userId) {
  try {
    // to get only ones that are not completed all in: AND is_completed = false AND status = 'pending'
    const sql = `
    SELECT *
FROM quests
WHERE user_id = $1
  AND is_completed = false
  AND (status = 'pending' OR status = 'failed')
ORDER BY id DESC;
`
    const results = await pool.query(sql, [userId])
    return results.rows
  } catch (err) {
    throw new Error(err)
  }
}

export async function getQuestById(userId, questId) {
  try {
    const sql = `SELECT * FROM quests WHERE user_id = $1 AND id = $2`
    const results = await pool.query(sql, [userId, questId])
    return results.rows[0]
  } catch (err) {
    throw new Error(err)
  }
}

export async function updateProgress(userId, questId, currentValue) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const parsedCurrentValue = Number(currentValue)
    if (!Number.isFinite(parsedCurrentValue) || parsedCurrentValue < 0) {
      throw new Error("Invalid currentValue")
    }

    const updateQuest = await client.query(`UPDATE quests SET current_value = $1 WHERE id = $2 AND user_id = $3 AND deadline > now() RETURNING *`,[parsedCurrentValue, questId, userId])

    let quest = updateQuest.rows[0]
    if (!quest) throw new Error("Quest not found")

    let expGained = 0
    let coinsGained = 0
    let level, exp, leveledUp = false;
    let completedNow = false

    if (quest.current_value >= quest.target_value && !quest.is_completed) {
      completedNow = true
      await client.query(`UPDATE quests SET status = 'completed', is_completed = true WHERE id = $1 AND user_id = $2 AND is_completed = false`,[questId, userId])
      
      const updatedQuestRes = await client.query(
        `SELECT * FROM quests WHERE id = $1`,
        [questId]
      )
      quest = updatedQuestRes.rows[0]

      const statRewards = quest.reward?.stats || {}
      const statMap = {
        discipline: "Discipline",
        focus: "Focus",
        endurance: "Endurance",
        strength: "Strength",
        recovery: "Recovery",
      }

      for (const [key, value] of Object.entries(statRewards)) {
        if (!value) continue
        const statName = statMap[key]
        if (!statName) continue
        await client.query(
          `INSERT INTO stat_rewards (quest_id, stat_name, value) VALUES ($1, $2, $3)`,
          [quest.id, statName, value]
        )
      }

      await client.query(
        `UPDATE user_stats
         SET discipline = discipline + $1,
             focus = focus + $2,
             endurance = endurance + $3,
             strength = strength + $4,
             recovery = recovery + $5
         WHERE user_id = $6`,
        [
          statRewards.discipline || 0,
          statRewards.focus || 0,
          statRewards.endurance || 0,
          statRewards.strength || 0,
          statRewards.recovery || 0,
          userId,
        ]
      )

        
    // Get progress row
    const progressRes = await client.query(`SELECT level, exp, coins FROM progress WHERE user_id = $1 FOR UPDATE`,[userId])
    if (!progressRes.rows[0]) throw new Error("No progress row for this user")

    
    level = progressRes.rows[0].level
    const baseExp = quest.reward?.exp || 0
    const baseCoins = quest.reward?.coins || 0
    const xpMultiplier = await getActiveMultiplier(client, userId, "xp_multiplier")
    const coinMultiplier = await getActiveMultiplier(client, userId, "coin_multiplier")
    expGained = Math.floor(baseExp * xpMultiplier)
    coinsGained = Math.floor(baseCoins * coinMultiplier)
    exp = progressRes.rows[0].exp + expGained
    const coins = progressRes.rows[0].coins + coinsGained

    leveledUp = false
    
    while (exp >= expToNextLevel(level)) {
      exp -= expToNextLevel(level)
      level += 1
      leveledUp = true
    }

    
    await client.query(`UPDATE progress SET level = $1, exp = $2, coins = $3 WHERE user_id = $4`,[level, exp, coins, userId])
    
}

    if (level === undefined || exp === undefined) {
      const progressRes = await client.query(`SELECT level, exp FROM progress WHERE user_id = $1`, [userId])
      if (progressRes.rows[0]) {
        level = progressRes.rows[0].level
        exp = progressRes.rows[0].exp
      }
    }

    if (level === undefined) level = 1
    if (exp === undefined) exp = 0
      
    await client.query("COMMIT")
    if (completedNow) {
      console.info(`Quest completed: userId=${userId}, questId=${questId}, expGained=${expGained}, coinsGained=${coinsGained}, leveledUp=${leveledUp}`)
    }
    return { quest: { ...quest, is_completed: quest.is_completed || completedNow }, expGained, coinsGained, level, exp, nextLevelExp: expToNextLevel(level), leveledUp }
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}

// Create the Quest
export async function createQuest(
  userId,
  { questTitle, type, unitName, targetValue, currentValue = 0 }
) {
  // insert a new quest in the DB and return the created quest
  try {
    const deadline = await createDeadline()
    const reward = computeExp(type, targetValue)

    //1: title, 2: deadline, 3: exp, 4: unit(the push-ups in Daily quests), 5: target, 6: the current value
    const sql = `INSERT INTO quests (user_id, title, type, deadline, reward, unit, target_value, current_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`

    const results = await pool.query(sql, [
      userId,
      questTitle,
      type,
      deadline,
      reward,
      unitName,
      targetValue,
      currentValue,
    ])
    return results.rows[0]
  } catch (err) {
    console.error(`createQuest failed: userId=${userId}, type=${type}, targetValue=${targetValue}`, err)
    throw err
  }
}
