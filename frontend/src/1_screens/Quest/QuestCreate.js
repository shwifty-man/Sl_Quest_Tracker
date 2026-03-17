import { useState } from "react"
import { View, Text, TextInput, Button, Pressable } from "react-native"
import { styles } from "../../2_services/styles"
import { useQuests, useError } from "../../2_services/context"
import DropDown from "../../3_components/DropDown"

const CreateQuest = ({ navigation }) => {
  const [questTitle, setQuestTitle] = useState("")
  const [unitName, setUnitName] = useState("")
  const [targetValue, setTargetValue] = useState(null)
  const [type, setType] = useState(null)
  const [typeItems, setTypeItems] = useState([
    { label: "Workout", value: "Workout" },
    { label: "Study", value: "Study" },
    { label: "Reading", value: "Reading" },
    { label: "Meditation", value: "Meditation" },
  ])

  const { questCreation } = useQuests()
  const { setError } = useError()

  async function handleQuestCreation() {
    if (questTitle && unitName && targetValue && type) {
      try {
        await questCreation(questTitle, type, unitName, targetValue)
        navigation.navigate("Home")
      } catch (err) {
        setError(err)
      }
    } else {
      return
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Quest</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#9FDAEF"
        value={questTitle}
        onChangeText={setQuestTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Unit"
        placeholderTextColor="#9FDAEF"
        value={unitName}
        onChangeText={setUnitName}
      />

      <DropDown
        value={type}
        onChange={setType}
        items={typeItems}
        setItems={setTypeItems}
        placeholder="Type"
      />

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Target"
        placeholderTextColor="#9FDAEF"
        value={targetValue}
        onChangeText={setTargetValue}
      />
      {questTitle && unitName && targetValue && type ? (
        <Pressable style={styles.button} onPress={handleQuestCreation}>
          <Text>Create Quest</Text>
        </Pressable>
      ) : null}

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text>Home</Text>
      </Pressable>
    </View>
  )
}

export default CreateQuest
