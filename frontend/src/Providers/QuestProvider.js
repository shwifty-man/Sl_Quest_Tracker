import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"

import {
  fetchQuests,
  fetchCreateQuests,
  fetchUpdateProgress,
} from "../4_api/quests.api.js"

import { useSSE } from "../2_services/context"

import { AuthContext } from "./AuthProvider"
import { ErrorContext } from "./ErrorProvider"

export const QuestContext = createContext()

export function QuestProvider({ children }) {

  const [quests, setQuests] = useState([])
  const [loadingForQuests, setLoadingForQuests] = useState(false)
  const [penaltyStatus, setPenaltyStatus] = useState(null)
  const [reward, setReward] = useState(null)

  const { token } = useContext(AuthContext)
  const { setError } = useContext(ErrorContext)
  const { es } = useSSE();

  useEffect(() => {

    if (!es) return;

    const handlePenaltyApplied = (event) => {

      const data = JSON.parse(event.data);

      setPenaltyStatus(data);
      setQuests((currentQuests) =>
        currentQuests.map((quest) =>
          String(quest.id) === String(data.questId)
            ? { ...quest, status: data.status }
            : quest
        )
      );

    };

    es.addEventListener(
      "penalty_applied",
      handlePenaltyApplied
    );

    return () => {

      es.removeEventListener(
        "penalty_applied",
        handlePenaltyApplied
      );

    };

  }, [es]);

  useEffect(() => {

    if (!es) return

    const handleRewardGranted = (event) => {

      const data = JSON.parse(event.data)

      setReward(data)

    }

    es.addEventListener(
      "reward_granted",
      handleRewardGranted
    )

    return () => {

      es.removeEventListener(
        "reward_granted",
        handleRewardGranted
      )

    }

  }, [es])

  /*
   * Get all user quests.
   */
  const getUserQuests = useCallback(
    async (activeToken) => {

      const effectiveToken =
        activeToken || token

      if (!effectiveToken) {
        setQuests([])
        return []
      }

      try {

        setLoadingForQuests(true)

        const results = await fetchQuests(effectiveToken)

        setQuests(
          Array.isArray(results)
            ? results
            : []
        )

        return results

      } catch (err) {

        setError(
          err?.message ||
          "Unable to load quests."
        )

        throw err

      } finally {

        setLoadingForQuests(false)

      }
    },
    [token, setError],
  )


  /*
   * Create a quest.
   */
  const questCreation = useCallback(
    async (questData, activeToken) => {

      const effectiveToken = activeToken || token

      if (!effectiveToken) {
        throw new Error("No authentication token.")
      }

      try {

        const result = await fetchCreateQuests(effectiveToken, questData)

        /*
         * Refresh the quest list after creation.
         */
        await getUserQuests(effectiveToken)

        return result

      } catch (err) {

        setError(err?.message || "Unable to create quest.")

        throw err
      }
    },
    [token, getUserQuests, setError],
  )


  /*
   * Update a quest.
   */
  const updateQuest = useCallback(
    async (questId, activeToken) => {

      const effectiveToken = activeToken || token

      if (!effectiveToken) {
        throw new Error("No authentication token.")
      }

      try {

        const result = await fetchUpdateProgress(effectiveToken, questId)

        await getUserQuests(effectiveToken)

        return result

      } catch (err) {

        setError(
          err?.message ||
          "Unable to update quest."
        )

        throw err
      }
    },
    [token, getUserQuests, setError],
  )

  const getQuestByFilter = useCallback(
    (statusFilter, typeFilter, sortFilter) => {
      let filteredQuests = [...quests]

      if (statusFilter !== "All") {
        filteredQuests = filteredQuests.filter(
          (quest) =>
            quest.status?.toLowerCase() ===
            statusFilter.toLowerCase()
        )
      }

      if (typeFilter !== "All") {
        const normalizedType =
          typeFilter === "Once"
            ? "One-time"
            : typeFilter

        filteredQuests = filteredQuests.filter(
          (quest) =>
            quest.type?.toLowerCase() ===
            normalizedType.toLowerCase()
        )
      }

      filteredQuests.sort((a, b) => {
        const dateA = new Date(a.created_at)
        const dateB = new Date(b.created_at)

        return sortFilter === "Oldest"
          ? dateA - dateB
          : dateB - dateA
      })

      return filteredQuests
    },
    [quests],
  )

  /*
   * Initial quest load.
   *
   * IMPORTANT:
   * Only token controls this effect.
   * Do not add the callback functions to the
   * dependency array or this can become a
   * fetch -> state update -> rerender -> fetch loop.
   */
  useEffect(() => {

    if (!token) {
      setQuests([])
      return
    }

    let cancelled = false

    async function loadQuests() {

      try {

        setLoadingForQuests(true)

        const results = await fetchQuests(token)

        if (cancelled) return

        setQuests(
          Array.isArray(results)
            ? results
            : []
        )

      } catch (err) {

        if (!cancelled) {

          setError(
            err?.message ||
            "Unable to load quests."
          )

        }

      } finally {

        if (!cancelled) {
          setLoadingForQuests(false)
        }

      }
    }

    loadQuests()

    return () => {
      cancelled = true
    }

  }, [token])


  return (
    <QuestContext.Provider
      value={{
        quests,
        penaltyStatus,
        setPenaltyStatus,
        loadingForQuests,
        reward,

        getUserQuests,
        getQuestByFilter,

        questCreation,
        updateQuest,

        setQuests,
      }}
    >
      {children}
    </QuestContext.Provider>
  )
}
