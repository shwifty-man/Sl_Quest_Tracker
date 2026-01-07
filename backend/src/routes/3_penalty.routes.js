// auth.routes.js
import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { getPenaltyController } from "../controllers/3_penalty.controller.js"

const router = express.Router()

// GET /penalties/active
router.get("/active", authenticate, getPenaltyController)

export default router
