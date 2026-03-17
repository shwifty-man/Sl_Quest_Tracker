import React from "react"
import { Pressable } from "react-native"
import Svg, { Circle, Path } from "react-native-svg"
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
      <Svg width={size} height={size} viewBox="0 0 512 512" fill={color}>
        {/* Gear body */}
        <Path d="M487.4 315.7l-42.7-24.7c3.7-19.6 3.7-39.9 0-59.5l42.7-24.7c7.7-4.4 10.9-13.8 7.7-22.3l-45.5-111.3c-3.3-8.1-11.2-13.3-20-12.9l-50.5 3.2c-14.7-12.4-30.4-22.4-47.6-29.7l-19.3-48.6c-2.8-7-9.5-11.6-17-11.6h-114c-7.5 0-14.2 4.6-17 11.6l-19.3 48.6c-17.2 7.3-32.9 17.3-47.6 29.7l-50.5-3.2c-8.8-.5-16.7 4.8-20 12.9l-45.5 111.3c-3.3 8.5.1 17.9 7.7 22.3l42.7 24.7c-3.7 19.6-3.7 39.9 0 59.5l-42.7 24.7c-7.7 4.4-10.9 13.8-7.7 22.3l45.5 111.3c3.3 8.1 11.2 13.3 20 12.9l50.5-3.2c14.7 12.4 30.4 22.4 47.6 29.7l19.3 48.6c2.8 7 9.5 11.6 17 11.6h114c7.5 0 14.2-4.6 17-11.6l19.3-48.6c17.2-7.3 32.9-17.3 47.6-29.7l50.5 3.2c8.8.5 16.7-4.8 20-12.9l45.5-111.3c3.3-8.5-.1-17.9-7.7-22.3zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
        {/* Inner circle */}
        <Circle cx="256" cy="256" r="50" fill="#000" />
      </Svg>
    </Pressable>
  )
}

export default SettingsIcon
