import cron from "node-cron"
import pool from "../../DB/0_config/db.js"


// Run a check every minute to see if user has failed a quest and activate penalty
export async function startCronJob() {
  cron.schedule("* * * * *", async () => {
    console.log("Running auto-fail check every minute")
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      // 1. Find all pending quests past deadline
      const markFailed = `UPDATE quests SET status = 'failed' WHERE status = 'pending' AND deadline < now() RETURNING id, user_id`
      // 2. Mark them as failed
      const failedQuests = (await client.query(markFailed)).rows
      // 3. Insert penalty rows if not already active
      for (const quest of failedQuests) {
        await client.query(
          `INSERT INTO penalties (user_id, active, started_at, ends_at)
         SELECT $1, true, now(), now() + interval '1 minutes'
         WHERE NOT EXISTS (SELECT 1 FROM penalties WHERE user_id = $1 AND active = true)`,
          [quest.user_id]
        )
        console.log(
          `User ${quest.user_id} failed quest ${quest.id}, penalty applied.`
        )
      }
      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
    } finally {
      client.release()
    }
  })
}
