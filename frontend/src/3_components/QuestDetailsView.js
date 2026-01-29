import { View, Text, TextInput } from "react-native"
import Warning, { styles, QuestDetails, text } from "../2_services/styles"
import Countdown from "./CountDown"
import { useEffect, useState } from "react"
import TriangleButton from "./triangleButton"

export default function QuestDetailsView({
  title,
  unit,
  current,
  target,
  deadLine,
  status,
  exp,
  questId,
  setNewValue,
}) {
  const [newValue, setLocalValue] = useState(current)

  useEffect(() => {
    setLocalValue(current)
  }, [current])


  async function handleUpdatingProgressUp() {
    const updated = newValue + 1
    setLocalValue(updated)
    setNewValue(updated)
  }

  async function handleUpdatingProgressDown() {
    if (newValue <= 0) return
    const updated = newValue - 1
    setLocalValue(updated)
    setNewValue(updated)
  }

  return (
    <View style={styles.container}>
      <View style={QuestDetails.detailsContent}>
        <View style={QuestDetails.sectionCard}>
          <Text style={QuestDetails.questTitle}>{title}</Text>
          <Text style={QuestDetails.questTitle}>Status: {status}</Text>
        </View>

        <View style={QuestDetails.questUnits}>
          <View style={QuestDetails.sectionLabel}>
            <Text style={QuestDetails.sectionLabelLeft}>{unit}</Text>

            <View style={QuestDetails.progressContainer}>
              <Text style={QuestDetails.sectionLabelRight}>
                {newValue} / {target}
              </Text>

              <View style={QuestDetails.arrowColumn}>
                <TriangleButton
                  direction="up"
                  onPress={handleUpdatingProgressUp}
                />
                <TriangleButton
                  direction="down"
                  onPress={handleUpdatingProgressDown}
                />
              </View>
            </View>
          </View>
          <Text style={text.dummyText}>
            Time left: <Countdown deadline={deadLine} />
          </Text>
        </View>

        <View>
          <Text style={text.normal}>
            Caution: Failure to complete the daily quest will result in an
            appropriate <Warning text="Penalty" />.
          </Text>
        </View>
      </View>
    </View>
  )
}
