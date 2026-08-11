import express from "express"
import pool from "./DB/0_config/db.js"
import path from "path"
import { fileURLToPath } from "url"

// Routes:
import authRoutes from "./src/routes/1_auth.routes.js"
import questRoutes from "./src/routes/2_quests.routes.js"
import penaltyRoutes from "./src/routes/3_penalty.routes.js"
import userRoutes from "./src/routes/4_user.routes.js"
import badgesRoutes from "./src/routes/5_badges.routes.js"
import shopRoutes from "./src/routes/6_shop.routes.js"

// Middleware/services:
import { startCronJob } from "./src/jobs/deadline.job.js"
import { authenticate } from "./src/middleware/auth.middleware.js"
import { addSseClient } from "./src/services/sse.service.js"
import { getServerLoggerMiddleware } from "./src/middleware/auth.middleware.js"

const PORT = process.env.PORT || 4000

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



async function startServer() {
  app.use(express.json())
  app.use(getServerLoggerMiddleware())

  app.use("/assets", express.static(path.join(__dirname, "assets")))

  app.get("/", (req, res) => {
    res.send("API is running!")
  })
  // Route for auth (Login/Register)
  app.use("/auth", authRoutes)
  // Route for quests
  app.use("/quests", questRoutes)
  // Route for active penalties
  app.use("/penalties", penaltyRoutes)
  // Route for user profile and stats
  app.use("/users", userRoutes)
  // Route for badges
  app.use("/badges", badgesRoutes)
  // Route for shop
  app.use("/shop", shopRoutes)
  // SSE endpoint
  app.get("/events", authenticate, (req, res) => {
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()
    res.write("event: connected\ndata: {}\n\n")
    addSseClient(res)
  })

  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    try {
      const client = await pool.connect()
      console.log("Database connection successful ✅")
      console.log("Database URL: " + process.env.DATABASE_URL)
      client.release()
    } catch (err) {
      console.error("Database connection error:", err)
    }
  })
}
startServer()
startCronJob()
