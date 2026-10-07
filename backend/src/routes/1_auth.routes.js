// auth.routes.js
import express from "express"
import { register, login } from "../controllers/1_auth.controller.js"
import { registerValidation } from "../validations/authValdation.js"
import { validate } from "../middleware/validation.middleware.js"
import { authenticate } from "../middleware/auth.middleware.js"
import pool from "../../DB/config/db.js"


const router = express.Router()

// POST /auth/register
router.post("/register", ...registerValidation, validate, register)

// POST /auth/login
router.post("/login", login)

router.post("/logout", authenticate, async (req, res) => {

    const token =
        req.headers.authorization?.split(" ")[1] ||
        req.query.token

    try {

        await pool.query(
            `INSERT INTO revoked_tokens (token)
             VALUES ($1)
             ON CONFLICT (token) DO NOTHING`,
            [token]
        )

        res.status(200).json({
            message: "Logged out successfully"
        })

    } catch (err) {

        console.error("Logout error:", err)

        res.status(500).json({
            message: "Failed to logout"
        })
    }
})

export default router


// NewUser11@gmail.com
// HunterHunter!1