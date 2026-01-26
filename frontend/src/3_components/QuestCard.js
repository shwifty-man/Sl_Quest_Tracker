import React from "react"
import { View, Text } from "react-native"
import { styles } from "../2_services/styles"

const QuestCard = ({ title, unit, current, target, deadLine }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.questTitle}>{title}</Text>
      <Text style={styles.unit}>{unit}</Text>
      <Text style={styles.progress}>{current}/{target}</Text>
      <Text>Time left: {deadLine}</Text>
    </View>
  )
}

export default QuestCard

