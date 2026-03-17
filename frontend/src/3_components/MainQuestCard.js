import React from "react"
import { Pressable, View, Text } from "react-native"
import { styles } from "../2_services/styles"
import { useNavigation } from "@react-navigation/native"
import Countdown from "./CountDown"

export default function MainQuestCard({
  id,
  title,
  status,
  current,
  target,
  deadLine,
}) {
  const navigation = useNavigation()

  function handleViewingQuest() {
    navigation.navigate("QuestDetails", {
      questId: id,
    })
  }
  return (
    <View style={styles.mainQuestCard}>
        <Pressable onPress={handleViewingQuest}>
          <View style={styles.mainQuestHeader}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          </View>
          <View>
            <View style={styles.mainQuestRow}>
              <Text style={styles.mainQuestText}>
                {current}/{target}
              </Text>
            </View>
            <View style={styles.mainQuestRow}>
              <Text style={styles.mainQuestText}>
                Time left: {<Countdown deadline={deadLine} />}
              </Text>
              <Text style={styles.mainQuestText}>Status: {status}</Text>
            </View>
          </View>
        </Pressable>
    </View>
  )
}
