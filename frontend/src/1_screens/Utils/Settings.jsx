import { Pressable, Text, View } from "react-native"

import { useAuth } from "../../2_services/context.js"
import { globalStyles } from "../../2_services/styles.js"

import BackArrow from "../../3_components/Utils/BackArrow.jsx"

import { useNavigation } from "@react-navigation/native"

const Settings = () => {

  const { logout } = useAuth()
  const navigation = useNavigation()

  async function handleLogout() {
    await logout()
  }

  return (
    <View style={globalStyles.container}>

      <View
        style={[
          globalStyles.innerContainer,
          {
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            padding: 20,
            paddingTop: 70,
          },
        ]}
      >

        <View
          style={{
            position: "absolute",
            top: 20,
            left: 20,
          }}
        >
          <BackArrow navigation={navigation} />
        </View>

        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: "#C62828",
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 'auto',
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "700",
            }}
          >
            Logout
          </Text>
        </Pressable>

      </View>

    </View>
  )
}

export default Settings