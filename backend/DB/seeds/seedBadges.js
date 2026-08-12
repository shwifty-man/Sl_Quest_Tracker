import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import pool from "./0_config/db.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const badgeFolder = path.join(__dirname, "..", "assets", "badges")

const isImage = (file) => {
  const ext = path.extname(file).toLowerCase()
  return ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp" || ext === ".svg"
}

const toTitleCase = (value) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

async function importBadges() {
  const client = await pool.connect()

  try {
    const files = fs.readdirSync(badgeFolder)

    for (const file of files) {
      if (!isImage(file)) continue

      const name = toTitleCase(path.basename(file, path.extname(file)))
      const imagePath = `/assets/badges/${file}`

      await client.query(
        `INSERT INTO badges (name, image_path) VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET image_path = EXCLUDED.image_path`,
        [name, imagePath]
      )

      console.log("Imported:", name)
    }
  } catch (err) {
    console.error("Failed to import badges:", err)
  } finally {
    client.release()
    await pool.end()
  }
}

importBadges()
