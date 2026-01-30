import React, { useEffect, useState } from "react"
import { View, Text, Pressable } from "react-native"
import { styles } from "../2_services/styles"
import { useNavigation } from "@react-navigation/native"
import Countdown from "./CountDown"
import { useQuests } from "../2_services/context"

const QuestCard = ({ id, title, unit, status, current, target, deadLine }) => {
  const navigation = useNavigation()
  const { getQuestPenalty } = useQuests()
  const [penalty, setPenalty] = useState(null)

  useEffect(() => {
    const fetchPenalty = async () => {
      if (penalty !== null) return

      try {
        const data = await getQuestPenalty()
        setPenalty(data)
      } catch (err) {
        console.log("Failed to fetch penalty:", err)
      }
    }

    fetchPenalty()
  }, [getQuestPenalty])

  function handleViewingQuest() {
    navigation.navigate("QuestDetails", {
      questId: id,
    })
  }

  return (
    <View style={styles.card}>
      <Pressable onPress={handleViewingQuest}>
        <Text style={styles.questTitle}>{title}</Text>
        <Text style={styles.unit}>{unit}</Text>
        <Text style={styles.progress}>
          {current}/{target}
        </Text>
        <Text style={styles.deadLine}>
          Time left: {<Countdown deadline={deadLine} />}
        </Text>
        <Text style={styles.progress}>Status: {status}</Text>
      </Pressable>
    </View>
  )
}

export default QuestCard
