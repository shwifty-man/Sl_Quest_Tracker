// auth.routes.js
import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { getListOfApps, getPenaltyController } from "../controllers/3_penalty.controller.js"

const router = express.Router()

// GET list of apps from the front-end
router.post("/list", authenticate, getListOfApps)

// GET /penalties/active
router.get("/active/:id", authenticate, getPenaltyController)

export default router
 