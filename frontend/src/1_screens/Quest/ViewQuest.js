import React, { useEffect, useState } from "react"
import { View, ActivityIndicator } from "react-native"
import { fetchQuestById } from "../../4_api/quests.api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { STORAGE_KEYS } from "../../2_services/storage"
import QuestDetailsView from "../../3_components/QuestDetailsView"
import { useQuests, useError } from "../../2_services/context"
import { styles } from "../../2_services/styles"

export default function QuestDetailPage({ route }) {
  const { questId } = route.params
  const { updateProgress } = useQuests()
  const { setError } = useError()
  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadQuest() {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
        const data = await fetchQuestById(token, questId)
        setQuest(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    loadQuest()
  }, [])

  const handleProgress = async (newValue) => {
    try {
      const updatedQuest = await updateProgress(quest.id, newValue)
      setQuest((prev) => ({
        ...prev,
        ...updatedQuest,
      }))
    } catch (err) {
      setError(err)
    }
  }

  if (loading) return <ActivityIndicator style={styles.progress} size="large" />

  return (
    <View style={{ flex: 1 }}>
      <QuestDetailsView
        title={quest.title}
        unit={quest.unit}
        current={quest.current_value}
        target={quest.target_value}
        deadLine={quest.deadline}
        status={quest.status}
        exp={quest.reward.exp}
        reward={quest.reward}
        questId={quest.id}
        setNewValue={handleProgress}
      />
    </View>
  )
}
