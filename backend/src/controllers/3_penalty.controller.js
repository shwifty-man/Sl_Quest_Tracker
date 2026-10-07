import { addListToRestricted, getPenaltyByQuest, getAllActivePenalties } from '../services/3_penalty.service.js';

// Get the active penalty
export async function getAllPenaltiesController(req, res) {
  try {
    const userId = req.user.id
    const getPenalty = await getAllActivePenalties(userId)
    if (getPenalty === null || getPenalty === undefined) {
      return res.status(200).json("There are no penalties active")
    }
    res.status(200).json(getPenalty)
  } catch (err) {
    console.error("getAllPenaltiesController error:", err)
    res.status(500).json({ err: err.message })
  }
}

// Get one active penalty
export async function getPenaltyForQuestController(req, res) {
  try {
    const userId = req.user.id
    const questId = parseInt(req.params.questId, 10)

    const getPenalty = await getPenaltyByQuest(questId, userId)

    if (!getPenalty) {
      return res.status(200).json({ message: "No active penalty for this quest", active: false });
    }

    res.status(200).json({
      active: true,
      endsAt: getPenalty.ends_at,
      restrictedApps: getPenalty.restrictedApps || []
    })
  } catch (err) {
    console.error("getPenaltyForQuestController error:", err)
    res.status(500).json(err)
  }
}

// Get the list of restricted app from front-end
export async function getListOfApps(req, res) {
  try {
    const userId = req.user.id
    const { list } = req.body
    const getList = await addListToRestricted(userId, list)
    res.status(200).json(getList)
  } catch (err) {
    console.error("getListOfApps error:", err)
    res.status(500).json(err)
  }
}  