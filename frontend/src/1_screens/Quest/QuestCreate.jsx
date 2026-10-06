import { useState } from "react"
import { View, Text, TextInput, Button, Pressable, TouchableOpacity, FlatList, Switch } from "react-native"
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { styles } from "../../2_services/styles.js"
import { questStyles } from "../../Styles/questStyles.js"
import { LinearGradient } from 'expo-linear-gradient';



import { useQuests, useError } from "../../2_services/context.js"

import DropDown from "../../3_components/Quests/DropDown.jsx"
import ExpPill from "../../3_components/Utils/ExpPill.jsx"
import QuestTypeIcon from "../../3_components/Quests/QuestTypeIcon.jsx"
import BackArrow from "../../3_components/Utils/BackArrow.jsx"



const CreateQuest = ({ navigation }) => {
  const [questTitle, setQuestTitle] = useState("")
  const [questDescription, setQuestDescription] = useState("")
  const [questTime, setQuestTime] = useState(new Date(Date.now() + 60 * 1000))

  const [deadline, setDeadline] = useState(
    new Date(questTime.getTime() + 45 * 60 * 1000)
  )
  const [questType, setQuestType] = useState("Daily")

  const [questTemplate, setQuestTemplate] = useState("Custom")

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);


  const difficultyList = [{ name: "Easy", expBoost: 50, color: '#58B341', minus: 0 }, { name: "Medium", expBoost: 100, color: '#2E78FF', minus: 15 }, { name: "Hard", expBoost: 175, color: '#7B61FF', minus: 30 }, { name: "Extreme", expBoost: 300, color: '#E5484D', minus: 45 }]
  const [difficulty, setDifficulty] = useState(difficultyList[0])
  const [difficultyOpen, setDifficultyOpen] = useState(false)

  const { questCreation } = useQuests()
  const { setError } = useError()

  async function handleQuestCreation() {
    if (questTitle && questTime && deadline && questType && difficulty) {
      try {
        await questCreation({ questTitle, questTime, deadline, questType, questDescription, difficulty })
        navigation.navigate("Home")
      } catch (err) {
        console.error(err)
        throw err
      }
    } else {
      return
    }
  }

  let dateTitle
  let iconName = 'calendar-clock-outline'
  let iconColor
  let dropDownDescription
  if (questType === 'Daily') {
    dateTitle = 'Time'
    iconName = 'clock-time-two-outline'
    iconColor = '#2E78FF'
    dropDownDescription = "What time should this quest happen each day?"
  } else if (questType === 'Weekly') {
    dateTitle = 'Day of Week'
    iconColor = '#7B61FF'
    dropDownDescription = "What day should this quest happen?"
  } else {
    dateTitle = 'Date and Time'
    iconColor = '#58B341'
    dropDownDescription = "When should this quest happen?"
  }


  console.log("questTime: ", questTime.toLocaleString())
  console.log("deadline: ", deadline.toLocaleString())

  return (
    <View style={{ justifyContent: "flex-start", backgroundColor: '#080F1A', height: '100%', padding: 20, paddingTop: 30, gap: 20 }}>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30, alignSelf: 'center', width: '100%', height: 60, position: 'relative' }}>
        <BackArrow navigation={navigation} />

        <View style={{ justifyContent: "flex-start", gap: 5 }}>
          <Text style={questStyles.questViewTitle}>Create Quest</Text>
          <Text style={questStyles.questSubViewTitle}>Build a new quest</Text>
        </View>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['transparent', '#505258', 'transparent']}
          style={{ position: 'absolute', bottom: -10, left: 0, right: 0, height: 1 }}
        />
      </View>

      {questTemplate === "Custom" && (
        <>
          <View style={{ gap: 10 }}>
            <Text style={questStyles.questTpyeText}>Quest Title</Text>
            <TextInput
              style={questStyles.dataInput}
              placeholder="e.g. Read for 20 minutes"
              placeholderTextColor="#505258"
              value={questTitle}
              onChangeText={setQuestTitle}
            />
          </View>

          <View style={questStyles.questTypeOuterContainerMainWrapper}>
            <Text style={questStyles.questTypeOuterContainerText}>Quest Type</Text>
            <View style={questStyles.questTypeOuterContainer}>
              <QuestTypeIcon
                Icon={MaterialCommunityIcons}
                name="calendar-week"
                Title="Weekly"
                onPress={() => setQuestType("Weekly")}
                selected={questType}
                color='#7B61FF'
              />
              <QuestTypeIcon
                Icon={MaterialCommunityIcons}
                name="calendar-plus"
                Title="Daily"
                onPress={() => setQuestType("Daily")}
                selected={questType}
                color='#2E78FF'
              />
              <QuestTypeIcon
                Icon={MaterialCommunityIcons}
                name="clock-outline"
                Title="Once"
                onPress={() => setQuestType("One-time")}
                selected={questType}
                color='#58B341'
              />
            </View>
          </View>

          <DropDown
            questType={questType}
            setQuestTime={setQuestTime}
            questTime={questTime}
            deadline={deadline}
            setDeadline={setDeadline}
            dateTitle={dateTitle}
            iconName={iconName}
            iconColor={iconColor}
            dropDownDescription={dropDownDescription}
          />

          <View style={{ gap: 10, backgroundColor: '#121628', padding: 5, borderRadius: 10 }}>
            <Text style={questStyles.questTpyeText}>Descriptoin (Optional)</Text>
            <TextInput
              style={[questStyles.dataInput, { minHeight: 80, maxHeight: 120 }]}
              placeholder="Add more details..."
              placeholderTextColor="#505258"
              value={questDescription}
              onChangeText={setQuestDescription}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={[questStyles.timePickerWrapper, { gap: 5 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text style={questStyles.questTpyeText}>Difficulty -</Text>
              <ExpPill number={difficulty.expBoost + 100} />
            </View>
            <Pressable
              style={questStyles.timeInput}
              onPress={() => setDifficultyOpen(!difficultyOpen)}
            >
              <Text style={[questStyles.inputText, { fontFamily: 'Orbitron_400Regular' }]}>
                <MaterialCommunityIcons name="lightning-bolt-outline" size={16} color={difficulty.color} />{" "}{difficulty.name}
              </Text>

              <Ionicons
                name={difficultyOpen ? "chevron-up" : "chevron-down"}
                size={16}
                color="#8fa0bb"
              />
            </Pressable>

            {difficultyOpen && (
              <View style={questStyles.dropdown}>
                <FlatList
                  data={difficultyList}
                  keyExtractor={(item) => item.name}
                  nestedScrollEnabled
                  renderItem={({ item }) => (
                    <Pressable
                      style={questStyles.timeOption}
                      onPress={() => {
                        setDifficulty(item);
                        setDifficultyOpen(false);
                      }}
                    >
                      <Text style={questStyles.inputText}>
                        {<MaterialCommunityIcons name="lightning-bolt-outline" size={16} color={item.color} />}{" "}
                        <Text style={{ fontFamily: "Orbitron_400Regular", fontSize: 12, }}>{item.name}</Text> + {item.expBoost} XP -{" "}<Text style={{ color: '#D32F2F' }}>{item.minus}</Text>{" "}mins</Text>
                    </Pressable>
                  )}
                />
              </View>
            )}
          </View>
        </>
      )}

      {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ color: '#fff' }}>Custom start time</Text>
        <Switch
          trackColor={{ false: '#152340', true: '#1A2846' }}
          thumbColor={isEnabled ? '#9BB8EA' : '#687ca0'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View> */}

      <Pressable style={[styles.button, { backgroundColor: iconColor, marginTop: 'auto' }]} onPress={handleQuestCreation}>
        <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Orbitron_400Regular' }}>Create Quest</Text>
      </Pressable>
    </View>
  )
}

export default CreateQuest
