import React from "react"
import { View, Text, Pressable } from "react-native"
import { styles } from "../2_services/styles"
import { useNavigation } from "@react-navigation/native"
import QuestDetailPage from "../1_screens/Quest/ViewQuest"
import Countdown from "./CountDown"

const QuestCard = ({ id, title, unit, current, target, deadLine }) => {
  const navigation = useNavigation()

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
      </Pressable>
    </View>
  )
}

export default QuestCard
