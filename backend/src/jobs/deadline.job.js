import cron from "node-cron"
import pool from "../../DB/0_config/db.js"
import { sendSseEvent } from "../services/sse.service.js"

/*
  refactor function to use eventEmitter (find exact name)
*/


export async function startCronJob() {
  console.info("Deadline job started (runs every 10 seconds)")
  cron.schedule("*/10 * * * * *", async () => {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      // 1. Find all pending quests past deadline
      const markFailed = `UPDATE quests SET status = 'failed'
      WHERE status = 'pending' 
      AND is_completed = false 
      AND deadline < now() 
      AND status != 'failed' 
      RETURNING id, user_id, status`
      // 2. Mark them as failed
      const failedQuests = (await client.query(markFailed)).rows
      if (failedQuests.length > 0) {
        console.info(`Deadline job marked failed quests: count=${failedQuests.length}`)
      }
      // 3. Insert penalty rows if not already active
      for (const quest of failedQuests) {
        await client.query(`
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
        console.info(`Penalty applied: userId=${quest.user_id}, questId=${quest.id}`)
        sendSseEvent("penalty_applied", {
          userId: quest.user_id,
          questId: quest.id,
          status: quest.status
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
