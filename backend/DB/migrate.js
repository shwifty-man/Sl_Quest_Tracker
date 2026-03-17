import dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import pool from "./0_config/db.js"

const migrations = [
  "Users/users.sql",
  "Users/user_stats.sql",
  "Users/progress.sql",
  "Store/Badges.sql",
  "Store/effects.sql",
  "Store/items.sql",
  "Store/shop_items.sql",
  "Store/user_effects.sql",
  "Users/user_badges.sql",
  "Users/user_inventory.sql",
  "Users/user_inventory_defaults.sql",
  "Quests/quests.sql",
  "Rewards/stat_rewards.sql",
  "Penalties/penalties.sql",
]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tablesDir = path.join(__dirname, "1_tables")

async function runMigrations() {
  try {
    for (const file of migrations) {
      console.log(`🔄 Running migration: ${file}`)
      const sqlPath = path.join(tablesDir, file)
      const sql = fs.readFileSync(sqlPath, "utf8")
      await pool.query(sql)
      console.log(`✅ Migration ${file} applied`)
    }
    console.log("🎉 All migrations completed successfully!")
  } catch (err) {
    console.error("❌ Error running migrations:", err)
    console.error("Check the SQL syntax in your migration files")
  } finally {
    await pool.end()
  }
}

runMigrations()
