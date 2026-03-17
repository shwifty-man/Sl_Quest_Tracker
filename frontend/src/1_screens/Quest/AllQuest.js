import { View, Text, FlatList } from "react-native"
import QuestCard from "../../3_components/QuestCard"
import { QuestDetails, styles } from "../../2_services/styles"
import { useQuests } from "../../2_services/context"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback } from "react"

const QuestsList = ({ filter }) => {
  const { quests, isLoading, getQuests, trackedQuestId } = useQuests()

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        await getQuests()
      }
      load()
    }, [getQuests]),
  )

  if (isLoading) return <Text style={styles.empty}>Loading...</Text>
  const titleText = filter !== "current" ? "COMPLETED QUESTS" : "SIDE QUESTS"
  return (
    <View style={QuestDetails.detailsContent}>
      <Text style={styles.sideQuestTitle}>{titleText}</Text>
      <FlatList
        style={{ flex: 1 }}
        data={quests
          .filter((q) =>
            filter === "current" ? q.id !== trackedQuestId : true,
          )
          .filter((q) =>
            filter === "completed"
              ? q.status === "completed" ||
                q.status === "failed" ||
                q.is_completed === true
              : q.status === "pending",
          )}
        extraData={[trackedQuestId, filter]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <QuestCard
            id={item.id}
            title={item.title}
            unit={item.unit}
            current={item.current_value}
            target={item.target_value}
            deadLine={item.deadline}
            status={item.status}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No active quests.</Text>}
        contentContainerStyle={quests.length === 0 && styles.center}
      />
    </View>
  )
}

export default QuestsList
