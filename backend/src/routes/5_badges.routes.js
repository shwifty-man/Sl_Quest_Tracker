import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { getBagesFromStore, updateUserBadges } from "../controllers/5_badges.controller.js"

const router = express.Router()

// GET all badges in store
router.get("/", authenticate, getBagesFromStore)

// UPDATE current user badge
router.patch("/select", authenticate, updateUserBadges)

export default router
