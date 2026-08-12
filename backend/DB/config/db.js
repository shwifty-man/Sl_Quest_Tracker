import pkg from "pg"
const { Pool } = pkg
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: false,
})

// Log when a client connects
pool.on("connect", () => {
  console.log("Connected to the database ✅")
})

// Log unexpected errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err)
})

export default pool
