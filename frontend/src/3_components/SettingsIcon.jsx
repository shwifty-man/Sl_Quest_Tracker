import React from "react"
import { Pressable } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native"

const SettingsIcon = ({ size = 20, color = "#9FDAEF" }) => {
  const navigation = useNavigation()

  function handleViewSettings() {
    navigation.navigate("Settings")
  }

  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
      onPress={handleViewSettings}
    >
      <Ionicons
        name="settings"
        size={size}
        color={color}
      />
    </Pressable>
  )
}

export default SettingsIcon
