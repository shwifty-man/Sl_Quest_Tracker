import express from "express"
import pool from "./0_config/db.js"
import authRoutes from "../src/routes/1_auth.routes.js"
import questRoutes from "../src/routes/2_quests.routes.js"

const app = express()
const PORT = process.env.PORT || 4000

async function startServer() {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    app.use(express.json()),
      app.get("/", (req, res) => {
        res.send("API is running!")
      })

    app.use("/auth", authRoutes)
    app.use("/quests", questRoutes)

    try {
      const client = await pool.connect()
      console.log("Database connection successful ✅")
      client.release()
    } catch (err) {
      console.error("Database connection error:", err)
    }
  })
}

startServer()
