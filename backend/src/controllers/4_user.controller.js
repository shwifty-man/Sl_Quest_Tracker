import { changeHunterName, getHunterName, getUserInventory, getUserProgress, getUserStats, updateUserStats, useInventoryItem } from "../services/4_user.service.js"
import { getUserBadge } from "../services/5_badges.service.js"

export async function updateUsernameController(req, res) {
  try {
    const userId = req.user.id
    const {newName} = req.body
    const hunterName = await changeHunterName(newName, userId)
    res.status(200).json(hunterName)
  } catch (err) {
    console.error("updateUsernameController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

export async function getUserProfileController(req, res) {
  try {
    const userId = req.user.id
    const hunterName = await getHunterName(userId)
    const stats = await getUserStats(userId)
    const progress = await getUserProgress(userId)
    const badge = await getUserBadge(userId)
    res.status(200).json({hunterName, stats, progress, badge})
  } catch (err) {
    console.error("getUserProfileController error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}

export async function updateUserStatsController(req, res) {
  try {
    const userId = req.user.id
    const {stats} = req.body
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

// export async function equipInventoryItemController(req, res) {
//   try {
//     res.status(501).json({ error: "Not implemented" })
//   } catch (err) {
//     console.error("equipInventoryItemController error:", err)
//     res.status(500).json({ error: err.message || "Internal Server Error" })
//   }
// }

// export async function unequipInventoryItemController(req, res) {
//   try {
//     res.status(501).json({ error: "Not implemented" })
//   } catch (err) {
//     console.error("unequipInventoryItemController error:", err)
//     res.status(500).json({ error: err.message || "Internal Server Error" })
//   }
// }

// Make sure newStats returns the updated stats