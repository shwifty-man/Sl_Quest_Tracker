import { getBadges, updateBadge } from "../services/5_badges.service.js"

export async function updateUserBadges(req, res) {
  try {
    const userId = req.user.id
    const {badgeId} = req.body
    const badge = await updateBadge(badgeId, userId)
    res.status(200).json(badge)
  } catch (err) {
    console.error("updateUserBadges error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}


export async function getBagesFromStore(req, res) {
  try {
    const badges = await getBadges()
    res.status(200).json(badges)
  } catch (err) {
    console.error("getBagesFromStore error:", err)
    res.status(500).json({ error: err.message || "Internal Server Error" })
  }
}