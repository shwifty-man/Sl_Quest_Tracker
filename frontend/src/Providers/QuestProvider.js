import React, { createContext, useState, useEffect, useContext } from "react"
import {
  fetchCreateQuests,
  fetchPenaltyForQuest,
  fetchQuestById,
  fetchQuests,
  fetchUpdateProgress,
} from "../4_api/quests.api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  getCachedQuests,
  setCachedQuests,
  STORAGE_KEYS,
} from "../2_services/storage"
import EventSource from "react-native-sse"
import { ErrorContext } from "./ErrorProvider"

export const QuestContext = createContext()

export function QuestProvider({ children }) {
  // 2a. State for user, token, and loading
  const [quests, setQuests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [trackedQuestId, setTrackedQuestId] = useState(null)
  const { setError } = useContext(ErrorContext)

  const getQuests = React.useCallback(async () => {
    // Get all quests
    try {
      setIsLoading(true)
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const allQuests = await fetchQuests(token)
      setQuests(allQuests)
      await setCachedQuests(allQuests)
      return allQuests
    } catch (err) {
      // Don't surface background fetch errors to the global ErrorOverlay
      console.warn("[quests] Failed to fetch quests (background):", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let sse

    async function connectToSSE() {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      if (!token) return

      await getQuests()

      sse = new EventSource(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/events?token=${token}`,
      )

      sse.addEventListener("penalty_applied", (event) => {
        const data = JSON.parse(event.data)
        console.info("[quests] Penalty update received")

        setQuests((prev) => {
          const exists = prev.some((q) => q.id === data.questId)
          if (exists) {
            return prev.map((q) =>
              q.id === data.questId ? { ...q, status: data.status } : q,
            )
          }
          return [...prev, data]
        })
      })

      sse.addEventListener("error", (err) => {
        console.warn("[quests] SSE connection error", err)
      })
    }

    connectToSSE()

    return () => {
      if (sse) sse.close()
    }
  }, [getQuests])

  const getQuestById = async (questId) => {
    try {
      setIsLoading(true)
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const quest = await fetchQuestById(token, questId)
      setQuests(quest)
      await setCachedQuests(quest)
      return quest
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const questCreation = async (questTitle, type, unitName, targetValue) => {
    try {
      // Get the token
      setIsLoading(true)
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const newQuest = await fetchCreateQuests(token, {
        questTitle,
        type,
        unitName,
        targetValue,
      })
      setQuests((prev) => [newQuest, ...prev])

      return newQuest
    } catch (err) {
      setError(err)
      console.error("[quests] Failed to create quest", err)
      return
    } finally {
      setIsLoading(false)
    }
  }

  const updateProgress = async (questId, newValue) => {
    try {
      setIsLoading(true)
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const newVal = await fetchUpdateProgress(token, questId, newValue)

      setQuests((prev) => prev.map((q) => (q.id === newVal.id ? newVal : q)))

      return newVal
    } catch (err) {
      setError(err)
      console.error("[quests] Failed to update quest progress", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getQuestPenalty = React.useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const penalty = await fetchPenaltyForQuest(token)

      return penalty || null
    } catch (err) {
      // Background poll failure — don't show global overlay
      console.warn("[quests] Failed to fetch quest penalty (background):", err)
      return null
    }
  }, [])

  useEffect(() => {
    async function loadQuests() {
      await getQuests()
    }
    loadQuests()
  }, [getQuests])

  // 3. Provide state & actions to children
  return (
    <QuestContext.Provider
      value={{
        quests,
        isLoading,
        trackedQuestId,
        getQuests,
        getQuestById,
        questCreation,
        updateProgress,
        getQuestPenalty,
        setTrackedQuestId,
      }}
    >
      {children}
    </QuestContext.Provider>
  )
}
