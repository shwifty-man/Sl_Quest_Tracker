import React, { useEffect, useState } from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { fetchQuestById } from "../../4_api/quests.api"
import QuestCard from "../../3_components/QuestCard"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { STORAGE_KEYS } from "../../2_services/storage"
import QuestDetailsView from "../../3_components/QuestDetailsView"
import { useQuests } from "../../2_services/context"

export default function QuestDetailPage({ route }) {
  const { questId } = route.params
  const { updateProgress } = useQuests()
  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadQuest() {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const data = await fetchQuestById(token, questId)
      setQuest(data)
      setLoading(false) 
    }
    loadQuest()
  }, [])

  if (loading) return <ActivityIndicator size="large" />

  return (
    <View style={{ flex: 1 }}>
      <QuestDetailsView
        title={quest.title}
        unit={quest.unit}
        current={quest.current_value}
        target={quest.target_value}
        deadLine={quest.deadline}
        status={quest.status}
        exp={quest.exp_reward}
        questId={quest.id}
        updateProgress={updateProgress}
      />
    </View>
  )
}
