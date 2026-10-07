import { changeHunterName, changeSetup, getHunterName, getUserInventory, getUserProgress, getUserStats, updateUserStats, useInventoryItem, getActiveEffects } from "../services/4_user.service.js"
import { getUserBadge } from "../services/5_badges.service.js"
import pool from "../../DB/config/db.js"

export async function updateUsernameController(req, res) {
  try {
    const userId = req.user.id
    const { newName } = req.body
    const hunterName = await changeHunterName(newName, userId)
    res.status(200).json(hunterName)
  } catch (err) {
    console.error("updateUsernameController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

export async function updateSetupController(req, res) {
  try {
    const userId = req.user.id
    const setup = await changeSetup(userId)
    console.log("SETUP: ", setup)
    res.status(200).json(setup)
  } catch (err) {
    console.error("setupController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

export async function getUserProfileController(req, res) {
  try {
    const userId = req.user.id
    const hunterName = await getHunterName(userId)
    const { stats, streak, weekly } = await getUserStats(userId)
    const progress = await getUserProgress(userId)
    const badge = await getUserBadge(userId)
    const setup = await pool.query("SELECT setup_complete FROM users WHERE id = $1", [userId])
    const data = setup.rows[0]
    console.log("PROFILE SETUP: ", data.setup_complete)

    res.status(200).json({ hunterName, stats, streak, weekly, progress, badge, setup: data.setup_complete })
  } catch (err) {
    console.error("getUserProfileController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

export async function updateUserStatsController(req, res) {
  try {
    const userId = req.user.id
    const { stats } = req.body
    const newStats = await updateUserStats(userId, stats)
    res.status(200).json(newStats)
  } catch (err) {
    console.error("updateUserStatsController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

export async function getUserInventoryController(req, res) {
  try {
    const userId = req.user.id
    const inventory = await getUserInventory(userId)
    res.status(200).json(inventory)
  } catch (err) {
    console.error("getUserInventoryController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

export async function useInventoryItemController(req, res) {
  try {
    const userId = req.user.id
    const { itemId } = req.body
    console.log("Use Item controller hit. ItemId: ", itemId)

    if (!itemId) {
      return res.status(400).json({ error: "itemId is required" })
    }

    const result = await useInventoryItem(userId, itemId)
    res.status(200).json(result)
  } catch (err) {
    console.error("useInventoryItemController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

export async function getActiveEffectsController(req, res) {
  try {
    const userId = req.user.id

    const activeEffects = await getActiveEffects(userId)
    res.status(200).json(activeEffects)
  } catch (err) {
    console.error("getActiveEffectsController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}