import {
  getUserQuests,
  getQuestById,
  createQuest,
  updateProgress,
} from "../services/2_quests.service.js"

export async function getQuestsController(req, res) {
  try {
    console.log("GET QUESTS CONTROLLER HIT");

    const userId = req.user.id;
    console.log("USER ID:", userId);

    const getQuests = await getUserQuests(userId);

    console.log("GET QUESTS RESULT:", getQuests);

    return res.status(200).json(getQuests);

  } catch (err) {
    console.error("GET QUESTS ERROR:", err);
    console.error("MESSAGE:", err.message);
    console.error("STACK:", err.stack);

    return res.status(500).json({
      message: err.message
    });
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
    const { questTitle, time, deadline, type, questDescription, difficulty } = questData;

    console.log("controller to create quest: ", questTitle, time, deadline, type, questDescription, difficulty)

    const newQuest = await createQuest(userId, { questTitle, time, type, deadline, questDescription, difficulty })

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

    const newProgress = await updateProgress(userId, questId)
    console.log("newProgress", newProgress)

    if (!newProgress) {
      return res.status(400).json({
        success: false,
        message: "Quest could not be completed."
      });
    }
    console.log("newProgress", newProgress)
    res.status(200).json(newProgress)
  } catch (err) {
    console.error("updateProgressController error:", err)
    res.status(500).json({ message: err.message })
  }
}