import { useState } from "react"
import { View, Text, TextInput, Button, Pressable } from "react-native"
import { styles } from "../../2_services/styles"
import { useQuests } from "../../2_services/context"



const CreateQuest = ({ navigation }) => {
  const [questTitle, setQuestTitle] = useState("")
  const [unitName, setUnitName] = useState("")
  const [targetValue, setTargetValue] = useState(null)

  const { questCreation } = useQuests()

  async function handleQuestCreation() {
    await questCreation(questTitle, unitName, targetValue)
    navigation.navigate("Home")
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

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Target"
        placeholderTextColor="#9FDAEF"
        value={targetValue}
        onChangeText={setTargetValue}
      />

      <Button
        title="button"
        onPress={handleQuestCreation}
      ></Button>
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
