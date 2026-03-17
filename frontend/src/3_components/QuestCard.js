import React from "react"
import { View, Text, Pressable } from "react-native"
import Svg, { Polygon } from "react-native-svg"
import { styles, text } from "../2_services/styles"
import { useNavigation } from "@react-navigation/native"
import { useQuests } from "../2_services/context"

const QuestCard = ({ id, title, status, current, target }) => {
  const navigation = useNavigation()
  const { setTrackedQuestId } = useQuests()

  function handleViewingQuest() {
    navigation.navigate("QuestDetails", {
      questId: id,
    })
  }

  return (
    <View style={styles.card}>
      <Pressable onPress={handleViewingQuest}>
        <Text style={styles.questTitle}>{title}</Text>

        <View style={styles.row}>
          <Text style={styles.progress}>
            {current}/{target}
          </Text>
          <Text style={styles.progress}>
            Status:{" "}
            <Text style={status === "failed" ? text.warning : null}>
              {status}
            </Text>
          </Text>

          {status === "pending" ? (
            <Pressable
              style={styles.cardPressable}
              onPress={(event) => {
                event.stopPropagation?.()
                setTrackedQuestId(id)
              }}
            >
              <Svg
                width="72"
                height="24"
                viewBox="0 0 72 24"
                preserveAspectRatio="none"
                style={styles.cardPressableShape}
                pointerEvents="none"
              >
                <Polygon
                  points="6,1 71,1 65,23 1,23"
                  fill="#5BA4DE"
                  stroke="#9FDAEF"
                  strokeWidth="2"
                />
              </Svg>
              <Text style={styles.cardPressableText}>Track</Text>
            </Pressable>
          ) : (
            <Text></Text>
          )}
        </View>
      </Pressable>
    </View>
  )
}

export default QuestCard
