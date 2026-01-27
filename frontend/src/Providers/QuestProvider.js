import React, { createContext, useState, useEffect } from "react"
import { fetchCreateQuests, fetchQuestById, fetchQuests } from "../4_api/quests.api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  getCachedQuests,
  setCachedQuests,
  STORAGE_KEYS,
} from "../2_services/storage"

export const QuestContext = createContext()

export function QuestProvider({ children }) {
  // 2a. State for user, token, and loading
  const [quests, setQuests] = useState([])
  const [isLoading, setIsLoading] = useState(false)

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

  const restoreQuests = async () => {
    // restore quests
    await getCachedQuests()
  }

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
      }}
    >
      {children}
    </QuestContext.Provider>
  )
}
