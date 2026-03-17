import { Button, View } from "react-native"
import { useAuth } from "../2_services/context"
import { styles } from "../2_services/styles"

const Settings = () => {
  const { logout } = useAuth()

  async function handleLogout() {
    await logout()
  }

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  )
}

export default Settings
