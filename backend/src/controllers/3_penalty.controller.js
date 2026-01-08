import { addListToRestricted, getActivePenalties } from '../services/3_penalty.service.js';

// Get the active penalty
export async function getPenaltyController(req, res) {
  try {
    const userId = req.user.id
    const penaltyId = req.params.id
    const getPenalty = await getActivePenalties(penaltyId, userId)
    if (getPenalty === null || getPenalty === undefined) {
      res.status(404).json("There are no penalties active")
    }
    res.status(200).json(getPenalty)
  } catch (err) {
    res.status(500).send(err)
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
    res.status(500).send(err)
  }
} 