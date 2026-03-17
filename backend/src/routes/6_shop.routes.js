import express from "express"
import { authenticate } from "../middleware/auth.middleware.js"
import { buyItemController, getShopItemsController } from "../controllers/6_shop.controller.js"

const router = express.Router()

// GET shop items
router.get("/", authenticate, getShopItemsController)

// BUY shop item
router.post("/buy", authenticate, buyItemController)

export default router
