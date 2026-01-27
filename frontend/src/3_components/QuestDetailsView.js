import React from "react"
import { View, Text } from "react-native"
import { styles, QuestDetails } from "../2_services/styles"
import { formatDeadline } from "../2_services/timeUtils"
import Countdown from "./CountDown"

export default function QuestDetailsView({
  title,
  unit,
  current,
  target,
  deadLine,
  status,
  exp,
}) {

  return (
    <View style={styles.container}>
      <View style={QuestDetails.detailsContent}>
        <View style={QuestDetails.sectionCard}>
          <Text style={QuestDetails.questTitle}>{title}</Text>
        </View>

        <View style={QuestDetails.sectionCard}>
          <View style={QuestDetails.sectionLabel}>
            <Text style={QuestDetails.sectionLabelLeft}>{unit}</Text>
            <Text style={QuestDetails.sectionLabelRight}>
              {current} / {target}
            </Text>
          </View>
          <View style={QuestDetails.sectionCard}>
            <View style={QuestDetails.sectionLabel}>
              <Text>Time left: </Text>
              <Countdown deadline={deadLine} />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
