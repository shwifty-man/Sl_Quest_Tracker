// user.routes.js
import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validation.middleware.js"
import { hunterNameValidation } from "../validations/hunterNameValidation.js"
import {
  updateUsernameController,
  getUserProfileController,
  updateUserStatsController,
  getUserInventoryController,
  useInventoryItemController,
  updateSetupController,
  getActiveEffectsController
} from "../controllers/4_user.controller.js"

const router = express.Router()

// GET current user profile
router.get("/profile", authenticate, getUserProfileController)

// PATCH update username
router.post("/name", authenticate, ...hunterNameValidation, validate, updateUsernameController)

// PATCH update username
router.put("/setup", authenticate, updateSetupController)

// PATCH update user stats
router.patch("/stats", authenticate, updateUserStatsController)

// GET user inventory
router.get("/inventory", authenticate, getUserInventoryController)

// POST use inventory item
router.post("/inventory/use", authenticate, useInventoryItemController)

// POST use inventory item
router.get("/inventory/effect", authenticate, getActiveEffectsController)

export default router
