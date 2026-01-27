import { View, Text, FlatList } from "react-native"
import QuestCard from "../../3_components/QuestCard"
import { styles } from "../../2_services/styles"
import { useQuests } from "../../2_services/context"

const QuestsList = () => {
  console.log("Rendering QuestsList")
  const { quests, isLoading } = useQuests()

  if (isLoading) return <Text>Loading...</Text>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quests: </Text>
      <FlatList
        style={{ flex: 1 }}
        data={quests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          console.log("Rendering item", item)
          return (
            <QuestCard
              id={item.id}
              title={item.title}
              unit={item.unit}
              current={item.current_value}
              target={item.target_value}
              deadLine={item.deadline} 
            />
          )
        }}
        ListEmptyComponent={<Text style={styles.empty}>No active quests.</Text>}
        contentContainerStyle={quests.length === 0 && styles.center}
      />
    </View>
  )
}

export default QuestsList
