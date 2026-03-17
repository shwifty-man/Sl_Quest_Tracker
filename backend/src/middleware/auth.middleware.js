// auth.middleware.js

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

export function requireRoles(...roles) {
  // return middleware that checks decoded token / user roles and allows or denies access
}
