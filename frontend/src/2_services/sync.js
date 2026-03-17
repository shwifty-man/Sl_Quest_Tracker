import { fetchQuests } from "../4_api/quests.api"
import { setCachedQuests } from "./storage"

export async function syncQuests(token) {
  const quests = await fetchQuests(token)
  await setCachedQuests(quests)
  return quests
}
