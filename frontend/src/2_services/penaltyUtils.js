import AsyncStorage from "@react-native-async-storage/async-storage"
import { fetchPenaltyForQuest } from "../4_api/quests.api"
import { STORAGE_KEYS } from "./storage"

const OVERLAY_TEST_MODE = false

export async function isAnyPenaltyActive() {
  try {
    // Get the penalty
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
    const penalty = await fetchPenaltyForQuest(token)

    // Check if the penalty is active
    if (penalty?.active === true) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.warn("[penalty] Penalty check failed", err)
    // In test mode on error, still return true
    return OVERLAY_TEST_MODE ? true : false
  }
}

export async function getActivePenalty() {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
    const penalty = await fetchPenaltyForQuest(token)
    return penalty || null
  } catch (err) {
    console.warn("[penalty] Active penalty fetch failed", err)
    return null
  }
}
