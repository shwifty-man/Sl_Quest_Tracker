import { Button, Pressable, Text, View } from "react-native"
import { home, styles } from "../2_services/styles"
import { useAuth, useQuests, useUser } from "../2_services/context"
import QuestsList from "./Quest/AllQuest"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { useEffect, useState, useCallback } from "react"
import { startAppWatcherService } from "../2_services/handleOverlay"
import MainQuestCard from "../3_components/MainQuestCard"
import Svg, { Polygon } from "react-native-svg"
import Profile from "../3_components/Profile"
import Edgeglow from "../3_components/EdgeGlow"
import SettingsIcon from "../3_components/SettingsIcon"

const Home = () => {
  const { quests, trackedQuestId } = useQuests()
  const navigation = useNavigation()
  const [filter, setFilter] = useState("current")

  useEffect(() => {
    async function load() {
      await startAppWatcherService()
    }
    load()
  }, [])

  const trackedQuest = quests.find((q) => q.id === trackedQuestId)

  return (
    <View style={styles.container}>
      <Edgeglow />
      <Profile />
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setFilter("current")}
          style={styles.filterPressable}
        >
          <Svg
            width="160"
            height="32"
            viewBox="0 0 160 32"
            preserveAspectRatio="none"
            style={styles.filterPressableShape}
            pointerEvents="none"
          >
            <Polygon
              points="12,1 148,1 158,31 2,31"
              fill="#5BA4DE"
              stroke="#9FDAEF"
              strokeWidth="2"
            />
          </Svg>
          <Text style={styles.filterPressableText}>Current Quests</Text>
        </Pressable>
        <Pressable
          onPress={() => setFilter("completed")}
          style={styles.filterPressable}
        >
          <Svg
            width="160"
            height="32"
            viewBox="0 0 160 32"
            preserveAspectRatio="none"
            style={styles.filterPressableShape}
            pointerEvents="none"
          >
            <Polygon
              points="12,1 148,1 158,31 2,31"
              fill="#5BA4DE"
              stroke="#9FDAEF"
              strokeWidth="2"
            />
          </Svg>
          <Text style={styles.filterPressableText}>Completed</Text>
        </Pressable>
      </View>
      {filter != "current" ? null : (
        <View style={home.mainQuestContainer}>
          <Text style={styles.mainQuestTitle}>MAIN QUESTS</Text>
          {!trackedQuest || trackedQuest.status !== "pending" ? (
            <View style={styles.mainQuestCard}>
              <Text style={styles.empty}>No tracked Quest</Text>
            </View>
          ) : (
            <MainQuestCard
              id={trackedQuest?.id}
              title={trackedQuest?.title}
              status={trackedQuest?.status}
              current={trackedQuest?.current_value}
              target={trackedQuest?.target_value}
              deadLine={trackedQuest?.deadline}
            />
          )}
        </View>
      )}
      <View
        style={[
          home.questListContainer,
          { flex: 1 },
          filter !== "current" && { borderTopWidth: 1 },
        ]}
      >
        <QuestsList filter={filter} />
      </View>
      <View style={[home.footer]}>
        <Pressable
          onPress={() => navigation.navigate("QuestCreate")}
          style={styles.pressableButton}
        >
          <Text style={{ fontSize: 18 }}>Create Quest</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Home
