import pool from "../../DB/config/db.js"
import { sendSseEvent } from "../services/sse.service.js"
import { myEmitter, boss } from "../services/eventEmitter.js";
import { levelFromExp, expRequiredForLevel } from "../utils/questHelper.js"

export async function startRewardWorker() {

    boss.work("quest-completed", async ([job]) => {
        const client = await pool.connect()
        try {

            const { questId, userId } = job.data;

            console.log("\nGot quest completion!");
            console.log(`Quest id: ${questId}, User id: ${userId}`)

            await client.query("BEGIN")

            // Get the reward
            const getReward = "SELECT reward FROM quests WHERE id = $1 and user_id = $2"
            const reward = await client.query(getReward, [questId, userId])
            console.log("Reward: ", reward.rows[0])

            if (!reward.rows[0]) {
                await client.query("ROLLBACK");
                return;
            }

            // Get coins from reward
            const coins = reward.rows[0].reward.coins
            console.log("Coins: ", coins)
            const updateUserCoinsSql = "UPDATE progress SET coins = coins + $1 WHERE user_id = $2;"
            await client.query(updateUserCoinsSql, [coins, userId])

            // Get user stats
            const statReward = 'INSERT INTO quest_rewards (quest_id, user_id, amount, granted_at) VALUES ($1, $2, $3, now()) ON CONFLICT (quest_id) DO NOTHING RETURNING *'
            const statResults = await client.query(statReward, [questId, userId, reward.rows[0].reward.exp])
            console.log("statResults: ", statResults.rows[0])

            if (!statResults.rows[0]) {
                await client.query("ROLLBACK");
                return;
            }

            // Get current progress
            const progressResult = await client.query("SELECT exp, exp_to_next_level, level FROM progress WHERE user_id = $1", [userId]);
            const progress = progressResult.rows[0];
            console.log("progress", progress)

            // Calulate new progress
            const newExp = progress.exp + reward.rows[0].reward.exp;

            const newLevel = levelFromExp(newExp);

            const nextLevelExp = expRequiredForLevel(newLevel + 1);

            // Upate progress
            const updateUserExp = 'UPDATE progress SET exp = $1, level = $2, exp_to_next_level = $3 WHERE user_id = $4 RETURNING *'
            const updateResults = await client.query(updateUserExp, [newExp, newLevel, nextLevelExp, userId])
            console.log("updateResults: ", updateResults.rows[0])


            await client.query("COMMIT")


            console.log("SENDING reward_granted SSE");
            console.log("asdf: ", reward.rows[0])
            sendSseEvent("reward_granted", {
                questId,
                userId,
                reward: reward.rows[0]
            });
            console.log("SENT reward_granted SSE");
        } catch (error) {
            await client.query("ROLLBACK")
            console.error("Reward job run failed:", error)
            throw error;
        } finally {
            client.release()
        }
    })

}