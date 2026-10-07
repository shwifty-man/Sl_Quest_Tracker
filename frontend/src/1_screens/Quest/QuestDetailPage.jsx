import React, { useEffect, useState } from "react"

import { View, Text, Pressable, ActivityIndicator } from "react-native"

import { MaterialCommunityIcons } from "@expo/vector-icons"

import CountdownTimer from "../../3_components/Quests/CountdownTimer.jsx"
import BackArrow from "../../3_components/Utils/BackArrow.jsx"
import QuestReward from "../../3_components/Quests/QuestReward.jsx"

import { styles } from "../../2_services/styles"
import { questDetailsStyles } from "../../Styles/questDetailsStyles"

import { useQuests, useError } from "../../2_services/context"
import { fetchQuestById, fetchUpdateProgress } from "../../4_api/quests.api"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { STORAGE_KEYS } from "../../2_services/storage"
import { parseDeadline } from "../../2_services/helperFuncs.js"


export default function QuestDetailPage({ route, navigation }) {
  const { questId } = route.params

  const [quest, setQuest] = useState(null)
  const [loading, setLoading] = useState(true)

  const { reward, getUserQuests, updateQuest, showReward, setShowReward } = useQuests()
  const { setError } = useError()

  useEffect(() => {

    async function loadQuest() {

      try {

        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)

        const data = await fetchQuestById(token, questId)

        console.log("fetched quest by id: ", data)
        setQuest(data)

      } catch (err) {

        setError(err)

      } finally {

        setLoading(false)

      }

    }

    loadQuest()

  }, [])

  if (loading) {
    return <ActivityIndicator style={styles.progress} size="large" />
  }

  const now = new Date().getTime();

  const start = new Date(quest?.created_at).getTime();

  const end = new Date(quest?.deadline).getTime();

  const MS_PER_HOUR = 1000 * 60 * 60;

  const currentHours = Math.max(
    0,
    Math.floor((now - start) / MS_PER_HOUR)
  );

  const totalHours = Math.max(
    0,
    Math.floor((end - start) / MS_PER_HOUR)
  );

  console.log("reward", reward)

  return (

    <View style={[styles.container, { padding: 20, paddingTop: 30 }]}>

      {reward?.reward?.reward && reward?.questId === questId && showReward && (
        <QuestReward
          onClose={() => setShowReward(false)}
        />
      )}

      {/* Header */}
      <View style={[questDetailsStyles.header, { flexDirection: 'row', alignItems: 'center', gap: 30, alignSelf: 'center', width: '100%', height: 60, position: 'relative' }]}>

        <BackArrow navigation={navigation} passedFunction={getUserQuests} />

        <Text style={questDetailsStyles.headerTitle}>
          QUEST DETAILS
        </Text>

        <View style={{ width: 40 }} />

      </View>


      {/* Quest */}
      <View style={questDetailsStyles.questCard}>

        <View style={questDetailsStyles.questTitleRow}>

          <View style={questDetailsStyles.questIcon}>
            <MaterialCommunityIcons
              name="shield-sword"
              size={35}
              color="#6C63FF"
            />
          </View>

          <View style={questDetailsStyles.questTitleContainer}>

            <Text style={questDetailsStyles.questTitle}>
              {quest.title}
            </Text>

            <Text style={questDetailsStyles.questType}>
              {quest.type}
            </Text>

          </View>

          <Text style={questDetailsStyles.questXP}>
            + {quest.reward.exp} XP
          </Text>

        </View>

        <View style={questDetailsStyles.divider} />

        <Text style={questDetailsStyles.description}>
          {quest.description || "No description provided"}
        </Text>

      </View>


      {/* Time Left */}
      <View
        style={[
          questDetailsStyles.progressCard,
          quest?.completed && questDetailsStyles.completedProgressCard,
        ]}
      >
        <View style={questDetailsStyles.timeIconContainer}>
          <MaterialCommunityIcons
            name="timer-outline"
            size={44}
            color={quest?.completed === true ? "#22C55E" : "#19C7FF"}
          />
        </View>

        <View style={questDetailsStyles.timeDivider} />

        <View style={questDetailsStyles.timeContent}>
          {new Date(quest?.deadline) < new Date() && quest?.is_completed != true ? <Text
            style={[
              questDetailsStyles.progressTitle,
              { color: "#EF4444" },
            ]}
          >
            Time Expired
          </Text> : <Text style={questDetailsStyles.progressTitle}>
            TIME LEFT
          </Text>}

          {quest?.completed ? (
            <Text
              style={[
                questDetailsStyles.timeValue,
                { color: "#22C55E" },
              ]}
            >
              Completed
            </Text>
          ) : (
            <CountdownTimer deadline={quest?.deadline} isCompleted={quest?.is_completed} />
          )}
        </View>

        <View style={questDetailsStyles.timeDivider} />

        <View style={questDetailsStyles.deadlineContent}>
          <Text style={questDetailsStyles.deadlineLabel}>
            Deadline
          </Text>

          <Text style={questDetailsStyles.deadlineValue}>
            {quest?.deadline
              ? new Date(quest.deadline).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })
              : "—"}
            {", "}
            {quest?.deadline
              ? new Date(quest.deadline).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })
              : "—"}
          </Text>
        </View>
      </View>


      {/* Details */}
      <View style={questDetailsStyles.detailsCard}>

        <View style={questDetailsStyles.infoRow}>

          <View style={questDetailsStyles.infoIcon}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={23}
              color="#FFD15C"
            />
          </View>

          <View>
            <Text style={questDetailsStyles.infoLabel}>
              Started at
            </Text>

            <Text style={questDetailsStyles.infoValue}>
              {quest?.start
                ? new Date(quest.start).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
                : "—"}
              {", "}
              {quest?.start
                ? new Date(quest.start).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
                : "—"}
            </Text>
          </View>

        </View>

        <View style={questDetailsStyles.divider} />

        <View style={questDetailsStyles.infoRow}>

          <View style={questDetailsStyles.infoIcon}>
            <MaterialCommunityIcons
              name="star-circle-outline"
              size={23}
              color="#FF6B6B"
            />
          </View>

          <Text style={questDetailsStyles.rewardLabel}>
            Rewards
          </Text>

          <Text style={questDetailsStyles.rewardValue}>
            + {quest.reward.exp} XP
          </Text>

        </View>

      </View>


      {/* Complete */}
      <View style={questDetailsStyles.bottomContainer}>

        <Pressable
          style={[
            questDetailsStyles.completeButton,
            (
              quest.status !== 'pending' ||
              new Date(quest.start).getTime() > Date.now()
            ) ? questDetailsStyles.disabledButton : { backgroundColor: "#145AE8" }
          ]}
          onPress={
            quest.is_completed === false
              ? () => updateQuest(questId)
              : null
          }>
          <Text style={questDetailsStyles.completeButtonText}>
            Mark as Complete
          </Text>
        </Pressable>

      </View>

    </View >
  )
}