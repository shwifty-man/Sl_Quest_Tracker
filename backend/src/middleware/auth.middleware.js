// auth.middleware.js
import morgan from "morgan"
import jwt from 'jsonwebtoken'


import { verifyJWT } from "../services/1_auth.service.js"

export function authenticate(req, res, next) {
  // read Authorization header, verify JWT via auth.service.verifyJWT,
  const token = req.headers.authorization?.split(" ")[1] || req.query.token
  if (!token) return res.status(401).send("Access denied. No token provided.")

  try {
    // attach userId (or user object) to req, call next() or respond 401
    const decoded = verifyJWT(token)
    req.user = decoded
    next()
  } catch (err) {
    console.warn("Authentication failed: invalid token")
    res.status(401).send("invalid Token")
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