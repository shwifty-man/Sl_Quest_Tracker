import { Button, Text, View } from "react-native"
import { styles } from "../2_services/styles"
import { useAuth } from "../2_services/context"
import QuestsList from "./Quest/AllQuest"
import { useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { startAppWatcherService } from "../2_services/handleOverlay"

const Home = ({ children }) => {
  const navigation = useNavigation()
  console.log("Rendering Home")
  const { logout } = useAuth()

  useEffect(() => {
    startAppWatcherService()
  }, [])

  async function handleLogout() {
    try {
      await logout()
      console.log("logged out")
    } catch (err) {
      throw new Error(err)
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button title="Logout" onPress={handleLogout}></Button>
      <Button
        title="Create Quest"
        onPress={() => navigation.navigate("QuestCreate")}
      ></Button>
      <View style={{ flex: 1 }}>
        <QuestsList />
      </View>
    </View>
  )
}

export default Home
