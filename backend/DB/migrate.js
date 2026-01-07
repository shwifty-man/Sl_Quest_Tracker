import dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import pool from "./0_config/db.js"

const migrations = [
  "0_users.sql",
  "1_penalties.sql",
  "2_quests.sql",
  "3_progress.sql",
]

async function runMigrations() {
  try {
    for (const file of migrations) {
      console.log(`🔄 Running migration: ${file}`)
      const sql = fs.readFileSync(`./DB/1_tables/${file}`, "utf8")
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
