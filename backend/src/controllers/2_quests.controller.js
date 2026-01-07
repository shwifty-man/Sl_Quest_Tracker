import {
  getUserQuests,
  getQuestById,
  createQuest,
  updateProgress,
  completeQuest,
} from "../services/2_quests.service.js"

export async function getQuestsController(req, res) {
  try {
    const userId = req.user.id
    const getQuests = await getUserQuests(userId)
    res.status(200).json(getQuests)
  } catch (err) {
    res.status(500).send(err)
  }
}

export async function getQuestsByIdController(req, res) {
  try {
    const userId = req.user.id
    const questId = req.params.id
    const getQuestId = await getQuestById(userId, questId)
    res.status(200).json(getQuestId)
  } catch (err) {
    res.status(500).send(err)
  }
}

export async function createQuestController(req, res) {
  try {
    const userId = req.user.id
    const { questData } = req.body
    const newQuest = await createQuest(userId, questData)
    res.status(201).json(newQuest)
  } catch (err) {
    res.status(500).send(err)
  }
}

export async function updateProgressController(req, res) {
  try {
    const userId = req.user.id
    const questId = req.params.id
    const currentValue = req.body
    const newProgress = await updateProgress(userId, questId, currentValue)
    res.status(200).json(newProgress)
  } catch (err) {
    res.status(500).send(err)
  }
}

export async function completeQuestController(req, res) {
  try {
    const userId = req.user.id
    const questId = req.params.id
    const completedQuest = await completeQuest(userId, questId)
    res.status(200).json(completedQuest)
  } catch (err) {
    res.status(500).send(err)
  }
}
