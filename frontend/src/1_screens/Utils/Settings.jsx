import { Button, View } from "react-native"
import { useAuth } from "../../2_services/context.js"
import { styles } from "../../2_services/styles.js"
import BackArrow from "../../3_components/Utils/BackArrow.jsx"
import { useNavigation } from "@react-navigation/native"

const Settings = () => {
  const { logout } = useAuth()
  const navigation = useNavigation()

  async function handleLogout() {
    await logout()
  }

  return (
    <View style={styles.container}>
      <BackArrow navigation={navigation} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  )
}

export default Settings
