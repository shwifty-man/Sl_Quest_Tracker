import React from "react"
import { View, Text, Pressable } from "react-native"
import { styles } from "../2_services/styles"
import { useQuests } from "../2_services/context"

const QuestCard = ({ id, title, unit, current, target, deadLine }) => {
  const { getQuestById } = useQuests()

  async function handleViewingQuest() {
    await getQuestById(id)
    
  }

  return (
    <View style={styles.card}>
      <Pressable onPress={() => {console.log("Quest pressed.")}}>
        <Text style={styles.questTitle}>{title}</Text>
        <Text style={styles.unit}>{unit}</Text>
        <Text style={styles.progress}>
          {current}/{target}
        </Text>
        <Text style={styles.deadLine}>Time left: {deadLine}</Text>
      </Pressable>
    </View>
  )
}

export default QuestCard
