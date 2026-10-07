//Quest Service Functions
import pool from "../../DB/config/db.js"
import cron from "node-cron"

import { myEmitter, boss } from "./eventEmitter.js";

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
    const sql = `
  SELECT *
  FROM quests
  WHERE user_id = $1
  ORDER BY
    CASE
      WHEN status = 'pending' THEN 1
      WHEN status = 'completed' THEN 2
      WHEN status = 'failed' THEN 3
      ELSE 4
    END,
    id DESC;
`;
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

export async function updateProgress(userId, questId) {
  console.log(`updateProgress: userId: ${userId}, questId: ${questId}`)

  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    const sql = `
  UPDATE quests 
  SET 
    is_completed = TRUE, 
    status = 'completed',
    completed_at = NOW() 
  WHERE 
    user_id = $1 
    AND id = $2 
    AND is_completed = FALSE 
    AND status = 'pending'
  RETURNING *;`;


    //    AND start <= now()
    //    AND deadline >= now() 
    const results = await client.query(sql, [userId, questId])
    const quest = results.rows[0];
    console.log("quest: ", quest)

    if (!quest) {
      await client.query("ROLLBACK")
      return;
    }

    const updateCompleted = await client.query(`UPDATE user_stats SET completed_quests = completed_quests + 1 WHERE user_id = $1 RETURNING completed_quests;`, [userId])

    const updateStreak = await client.query(
      `UPDATE streaks
       SET
         current_streak = CASE
           WHEN last_completed_at::date = CURRENT_DATE
             THEN current_streak
           WHEN last_completed_at::date = CURRENT_DATE - 1
             THEN current_streak + 1
           ELSE 1
         END,
    
         longest_streak = GREATEST(
           longest_streak,
           CASE
             WHEN last_completed_at::date = CURRENT_DATE
               THEN current_streak
             WHEN last_completed_at::date = CURRENT_DATE - 1
               THEN current_streak + 1
             ELSE 1
           END
         ),
    
         last_completed_at = NOW()
    
       WHERE user_id = $1
    
       RETURNING current_streak, longest_streak, last_completed_at;`,
      [userId]
    )

    console.log("Completed Quests:", updateCompleted.rows[0])
    console.log("Streak:", updateStreak.rows[0])



    await client.query("COMMIT")

    const job = await boss.send(
      "quest-completed",
      {
        questId: quest.id,
        userId: quest.user_id
      }
    );

    console.log("Job: ", job)

    return quest;
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    await client.release()
  }
}

export async function recurringQuest(userId, quest) {
  try {
    console.log("(recurringQuest) quest:", quest);

    let cronTime = "";

    // One-time quests do not repeat.
    if (quest.type === "One-time") {
      return;
    }

    if (quest.type === "Daily") {
      cronTime = `0 ${quest.deadline.getMinutes()} ${quest.deadline.getHours()} * * *`;
    } else if (quest.type === "Weekly") {
      cronTime = `0 ${quest.deadline.getMinutes()} ${quest.deadline.getHours()} * * ${quest.deadline.getDay()}`;
    } else {
      throw new Error(
        "There was an error in recurringQuest. quest type did not match what you set"
      );
    }

    cron.schedule(cronTime, async () => {
      // Copy both the start and deadline of the current quest
      const nextStart = new Date(quest.start);
      const nextDeadline = new Date(quest.deadline);

      if (quest.type === "Daily") {
        nextStart.setDate(nextStart.getDate() + 1);
        nextDeadline.setDate(nextDeadline.getDate() + 1);
      } else if (quest.type === "Weekly") {
        nextStart.setDate(nextStart.getDate() + 7);
        nextDeadline.setDate(nextDeadline.getDate() + 7);
      }

      console.log("Creating recurring quest");
      console.log("Old start:", quest.start);
      console.log("New start:", nextStart);
      console.log("Old deadline:", quest.deadline);
      console.log("New deadline:", nextDeadline);

      await createQuest(
        userId,
        {
          questTitle: quest.title,
          time: nextStart,
          deadline: nextDeadline,
          type: quest.type,
          questDescription: quest.description,
          difficulty: quest.difficulty
        },
        false
      );
    });
  } catch (err) {
    throw err;
  }
}

export async function createQuest(userId, { questTitle, time, deadline, type, questDescription, difficulty }, shouldSchedule = true) {
  // insert a new quest in the DB and return the created quest
  try {
    const { createdDeadline, reward } = computeExp(deadline, difficulty)

    const sql = `INSERT INTO quests (user_id, title, type, start, deadline, description, difficulty, reward) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`

    const results = await pool.query(sql, [
      userId,
      questTitle,
      type,
      time,
      createdDeadline,
      questDescription,
      difficulty,
      reward,
    ])

    const quest = results.rows[0]

    if (shouldSchedule) {
      await recurringQuest(userId, quest)
    }

    const jobId = await boss.send(
      "quest-deadline",
      { questId: quest.id },
      {
        startAfter: quest.deadline
      }
    );

    return quest
  } catch (err) {
    console.error(`createQuest failed: userId=${userId}, type=${type}`, err)
    throw err
  }
}
