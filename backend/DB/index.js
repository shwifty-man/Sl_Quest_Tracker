import express from "express"
import pool from "./0_config/db.js"
import authRoutes from "../src/routes/1_auth.routes.js"
import questRoutes from "../src/routes/2_quests.routes.js"
import penaltyRoutes from "../src/routes/3_penalty.routes.js"
import { startCronJob } from "../src/jobs/deadline.job.js"
import morgan from "morgan"
import jwt from 'jsonwebtoken'

const PORT = process.env.PORT || 4000

const app = express()

function getServerLoggerMiddleware() {
  morgan.token("body", (req) => {
    if (!req.body || Object.keys(req.body).length === 0) return "";
    try {
      return JSON.stringify(req.body);
    } catch {
      if (typeof req.body === "string") {
        return req.body;
      }
      console.log('body', req.body);
      return "[unserializable body]";
    }
  });
  morgan.token('auth', function (req, res) {
    const raw_token = req.headers['authorization']?.replaceAll('Bearer ', '')?.replaceAll('"', '')
    if (!raw_token) return 'no-token'
    const decoded = jwt.decode(raw_token)
    if (!decoded) return `invalid-token: "${raw_token}"`
    if (typeof decoded === 'string') return `decoded-string-token: "${decoded}"`
    let stringified = ''
    try {
      stringified = JSON.stringify(decoded)
    } catch {
      stringified = '[unserializable decoded token]'
    }
    return `decoded-token: ${stringified}`
  })
  
  return morgan(":method :url :status :response-time ms - auth=:auth body=:body")
}

async function startServer() {
  app.use(express.json())
  app.use(getServerLoggerMiddleware())
  app.get("/", (req, res) => {
    res.send("API is running!")
  })
  // Route for auth (Login/Register)
  app.use("/auth", authRoutes)
  // Route for quests
  app.use("/quests", questRoutes)
  // Start checking if quests failed
  startCronJob()
  // Route for active penalties
  app.use("/penalties", penaltyRoutes)

  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
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
