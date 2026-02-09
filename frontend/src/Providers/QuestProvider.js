import React, { createContext, useState, useEffect } from "react"
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

export const QuestContext = createContext()

export function QuestProvider({ children }) {
  // 2a. State for user, token, and loading
  const [quests, setQuests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    let sse

    async function connectToSSE() {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      if (!token) return

      // Load quests first
      await getQuests()

      sse = new EventSource(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/events?token=${token}`,
      )

      sse.addEventListener("connected", () => console.log("SSE connected"))

      sse.addEventListener("penalty_applied", (event) => {
        const data = JSON.parse(event.data)
        console.log("Penalty applied:", data)

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

      sse.addEventListener("error", (err) => console.warn("SSE error", err))
    }

    connectToSSE()

    return () => {
      console.log("Closing sse")
      if (sse) sse.close()
    }
  }, [])

  const getQuests = async () => {
    // Get all quests
    try {
      setIsLoading(true)
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const allQuests = await fetchQuests(token)
      setQuests(allQuests)
      await setCachedQuests(allQuests)
      return allQuests
    } catch (err) {
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getQuestById = async (questId) => {
    try {
      setIsLoading(true)
      console.log("Starting to get all Quests")
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const quest = await fetchQuestById(token, questId)
      setQuests(quest)
      await setCachedQuests(quest)
      return quest
    } catch (err) {
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const questCreation = async (questTitle, unitName, targetValue) => {
    try {
      // Get the token
      setIsLoading(true)
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const newQuest = await fetchCreateQuests(token, {
        questTitle,
        unitName,
        targetValue,
      })
      setQuests((prev) => [newQuest, ...prev])

      return newQuest
    } catch (err) {
      console.error(err)
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

      console.log("New Value: ", newVal)

      return newVal
    } catch (err) {
      console.log("Error Updating quest: ", err)
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
      console.log("Error fetching quest penalty:", err)
      return null
    }
  }, [])

  useEffect(() => {
    async function loadQuests() {
      await getQuests()
    }
    loadQuests()
  }, [])

  // 3. Provide state & actions to children
  return (
    <QuestContext.Provider
      value={{
        quests,
        isLoading,
        getQuests,
        getQuestById,
        questCreation,
        updateProgress,
        getQuestPenalty,
      }}
    >
      {children}
    </QuestContext.Provider>
  )
}
