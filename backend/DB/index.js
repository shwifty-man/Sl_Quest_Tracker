import express from "express"
import pool from "./0_config/db.js"

const app = express()
const PORT = process.env.PORT || 4000

async function startServer() {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)

    app.get("/", (req, res) => {
      res.send("API is running!")
    })

    try {
      const client = await pool.connect()
      console.log("Database connection successful ✅")
      console.log(`DB URl: ${process.env.DATABASE_URL}`)
      client.release()
    } catch (err) {
      console.error("Database connection error:", err)
    }
  })
}

startServer()
