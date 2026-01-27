import { Button, Text, View } from "react-native"
import { styles } from "../2_services/styles"
import { useAuth } from "../2_services/context"
import QuestsList from "./Quest/AllQuest"

const Home = ({ children }) => {
  console.log("Rendering Home")
  const { logout } = useAuth()

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
      <View style={{flex:1}}>
        <QuestsList />
      </View>
    </View>
  )
}

export default Home
