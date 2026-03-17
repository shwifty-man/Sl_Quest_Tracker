// auth.routes.js
import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { getAllPenaltiesController, getListOfApps, getPenaltyForQuestController } from "../controllers/3_penalty.controller.js"

const router = express.Router()

// GET list of apps from the front-end
router.post("/list", authenticate, getListOfApps)

router.get("/active", authenticate, getAllPenaltiesController)

// GET /penalties/active
router.get("/quest/:questId", authenticate, getPenaltyForQuestController)

export default router
