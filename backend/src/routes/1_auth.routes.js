// auth.routes.js
import express from "express"
import { register, login } from "../controllers/1_auth.controller.js"
import { registerValidation } from "../validations/authValdation.js"
import { validate } from "../middleware/validation.middleware.js"

const router = express.Router()

// POST /auth/register
router.post("/register", ...registerValidation, validate, register)

// POST /auth/login
router.post("/login", login)

export default router
