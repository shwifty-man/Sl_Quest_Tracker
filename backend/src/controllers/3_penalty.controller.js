import { getActivePenalties } from '../services/3_penalty.service.js';

export async function getPenaltyController(req, res) {
  try {
    const userId = req.user.id
    const penaltyId = req.params.id
    const getPenalty = await getActivePenalties(penaltyId, userId)
    res.status(200).json(getPenalty)
  } catch (err) {
    res.status(500).send(err)
  }
}