import { View, Text } from "react-native"
import Warning, { styles, QuestDetails, text } from "../2_services/styles"
import Countdown from "./CountDown"
import { useEffect, useState } from "react"
import TriangleButton from "./triangleButton"
import QuestReward from "./QuestReward"
import Tag from "./Tag"

export default function QuestDetailsView({
  title,
  unit,
  current,
  target,
  deadLine,
  setNewValue,
  status,
  exp,
  reward,
}) {
  const [newValue, setLocalValue] = useState(current)

  useEffect(() => {
    setLocalValue(current)
  }, [current])

  function handleUpdatingProgressUp() {
    const updated = newValue + 1
    setLocalValue(updated)
    setNewValue(updated)
  }

  function handleUpdatingProgressDown() {
    if (newValue <= 0) return
    const updated = newValue - 1
    setLocalValue(updated)
    setNewValue(updated)
  }

  return (
    <View style={styles.container}>
      <View style={QuestDetails.wrapper}>
        {status === "completed" ? <QuestReward reward={reward} /> : null}
        <View style={QuestDetails.detailsContent}>
          <Tag text="INFO" />
          <View style={QuestDetails.header}>
            <Text
              style={[
                QuestDetails.detailsQuestTitle,
                newValue >= target && text.success,
              ]}
            >
              [Quest: {title}.]
            </Text>
          </View>

          <View style={QuestDetails.questUnits}>
            <View style={QuestDetails.sectionLabel}>
              <Text style={QuestDetails.sectionLabelLeft}>{unit}</Text>

              <View style={QuestDetails.progressContainer}>
                <Text
                  style={[
                    QuestDetails.sectionLabelRight,
                    newValue >= target && text.success,
                  ]}
                >
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

          <View style={QuestDetails.footer}>
            <Text style={text.normal}>
              Caution: Failure to complete the quest will result in an
              appropriate <Warning text="Penalty" />.
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
