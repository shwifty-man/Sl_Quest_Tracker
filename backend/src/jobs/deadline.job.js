import pool from "../../DB/config/db.js"
import { sendSseEvent } from "../services/sse.service.js"
import { myEmitter, boss } from "../services/eventEmitter.js";

export async function startDeadlineWorker() {

  boss.work("quest-deadline", async ([job]) => {
    console.log("\nGot quest Deadline!", job, job.id, job.data, job.name);
    const { questId } = job.data;

    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      // 1. Find all pending quests past deadline
      const markFailed = `UPDATE quests SET status = 'failed'
      WHERE id = $1
AND status = 'pending'
AND is_completed = false
AND deadline <= now()
      RETURNING id, user_id, status`
      // 2. Mark them as failed
      const failedQuests = (await client.query(markFailed, [questId])).rows
      if (failedQuests.length > 0) {
        console.info(`Deadline job marked failed quests: count=${failedQuests.length}`)
      }
      // 3. Insert penalty rows if not already active
      for (const quest of failedQuests) {
        const result = await client.query(`
        INSERT INTO penalties (user_id, quest_id, active, started_at, ends_at)
SELECT $1, $2, true, now(), now() + interval '1 hours'
WHERE NOT EXISTS (
    SELECT 1 
    FROM penalties 
    WHERE user_id = $1 AND quest_id = $2 AND active = true
)
RETURNING *;`,
          [quest.user_id, quest.id]
        );
        const penalty = result.rows[0]

        const updateMissedQuests = await client.query(`UPDATE user_stats SET missed_quests = missed_quests + 1 WHERE user_id = $1 RETURNING missed_quests;`, [quest.user_id])
        console.log("Missed Quests: ", updateMissedQuests.rows[0])

        console.info(`Penalty applied: userId=${quest.user_id}, questId=${quest.id}`)

        sendSseEvent("penalty_applied", {
          userId: quest.user_id,
          questId: quest.id,
          status: quest.status,
          active: penalty?.active,
          penaltyDeadline: penalty?.ends_at
        })
      }
      // If the penalty ended then set active to false
      await client.query(`UPDATE penalties SET active = false WHERE active = true AND ends_at <= now()`)

      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      console.error("Deadline job run failed:", error)
    } finally {
      client.release()
    }
  })
}
