// auth.controller.js
import { registerUser, loginUser } from "../services/1_auth.service.js"

export async function register(req, res) {
  // extract data from req.body, call auth.service.registerUser, send JSON response
  try {
    const { name, email, password } = req.body
    const user = await registerUser(name, email, password)
    res.status(200).json(user)
  } catch (err) {
    console.error("register controller error:", err)
    res.status(500).json(err.message)
  }
}

export async function login(req, res) {
  // extract credentials from req.body, call auth.service.loginUser, send JSON response
  try {
    const { email, password } = req.body
    const user = await loginUser(email, password)
    res.status(200).json(user)
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

export function me(req, res) {
  // optional: return current user info (expects middleware to have set req.userId)
}
