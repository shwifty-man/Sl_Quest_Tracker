import React from "react"
import { Pressable, View } from "react-native"

export default function TriangleButton({
  direction = "up",
  size = 24,
  color = "#62D5F8",
  onPress,
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size / 3,
          borderRightWidth: size / 3,
          borderBottomWidth: direction === "up" ? size : 0,
          borderTopWidth: direction === "down" ? size : 0,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: direction === "up" ? color : "transparent",
          borderTopColor: direction === "down" ? color : "transparent",
          marginBottom: 3
        }}
      />
    </Pressable>
  )
}
