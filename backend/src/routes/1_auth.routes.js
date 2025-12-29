// auth.routes.js
import express from "express"
import { register, login } from "../controllers/1_auth.controller.js"

const router = express.Router()

// POST /auth/register
router.post("/register", register)

// POST /auth/login
router.post("/login", login)

export default router
