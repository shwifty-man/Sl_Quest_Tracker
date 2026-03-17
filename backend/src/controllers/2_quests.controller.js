import {
  getUserQuests,
  getQuestById,
  createQuest,
  updateProgress,
} from "../services/2_quests.service.js"

export async function getQuestsController(req, res) {
  try {
    const userId = req.user.id
    const getQuests = await getUserQuests(userId)
    res.status(200).json(getQuests)
  } catch (err) {
    res.status(400).json(err.message)
  }
}

export async function getQuestsByIdController(req, res) {
  try {
    const userId = req.user.id
    const questId = req.params.id
    const getQuestId = await getQuestById(userId, questId)
    res.status(200).json(getQuestId)
  } catch (err) {
    res.status(400).json(err.message)
  }
}

export async function createQuestController(req, res) {
  try {
    const userId = req.user.id
    const { questData } = req.body;
    if (!questData) {
      return res.status(400).json({ message: "No quest data provided" });
    }
    const { questTitle, type, unitName, targetValue } = questData;

    const newQuest = await createQuest(userId, { questTitle, type, unitName, targetValue })

    res.status(201).json(newQuest)
  } catch (err) {
    console.error("createQuestController error:", err)
    res.status(500).json({
    message: err.message,
  });

  }
}

export async function updateProgressController(req, res) {
  try {
    const userId = req.user.id
    const questId = req.params.id
    const {currentValue} = req.body
    const newProgress = await updateProgress(userId, questId, currentValue)
    res.status(200).json(newProgress)
  } catch (err) {
    console.error("updateProgressController error:", err)
    res.status(500).json({ message: err.message })
  }
}