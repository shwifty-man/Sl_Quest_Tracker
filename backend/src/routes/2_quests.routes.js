// auth.routes.js
import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validation.middleware.js"
import { createQuestValidation } from "../validations/questsValidation.js"
import {
  getQuestsController,
  getQuestsByIdController,
  createQuestController,
  updateProgressController,
} from "../controllers/2_quests.controller.js"

const router = express.Router()

// GET all quests
router.get("/", authenticate, getQuestsController)

// GET quest by id
router.get("/:id", authenticate, getQuestsByIdController)

// POST a new quest
router.post("/", authenticate, ...createQuestValidation, validate, createQuestController)

// POST an update
router.post("/:id/update", authenticate, updateProgressController)


export default router
