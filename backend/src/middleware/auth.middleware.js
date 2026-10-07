import morgan from "morgan"
import jwt from "jsonwebtoken"

import { verifyJWT } from "../services/1_auth.service.js"
import pool from "../../DB/config/db.js"


export async function authenticate(req, res, next) {

  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.query.token

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).send("Access denied. No valid token provided.")
  }

  try {

    // Check whether token has been logged out
    const revoked = await pool.query(
      "SELECT id FROM revoked_tokens WHERE token = $1",
      [token]
    )

    if (revoked.rows.length > 0) {
      return res
        .status(401)
        .send("Token has been revoked.")
    }

    // Verify JWT
    const decoded = verifyJWT(token)

    req.user = decoded

    next()

  } catch (err) {

    console.warn("Authentication failed:", err)

    return res
      .status(401)
      .send("Invalid token")
  }
}

export function getServerLoggerMiddleware() {
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