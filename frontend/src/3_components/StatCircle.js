import React from "react"
import { View, Text } from "react-native"
import Svg, { Circle } from "react-native-svg"
import { styles } from "../2_services/styles"

export default function StatCircle({ value = 0, color = "#5BA4DE", label }) {
  const size = 80
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0
  const progress = Math.min(100, Math.max(0, safeValue))
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <View style={{ alignItems: "center", gap: 6 }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1b2a38"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={styles.glowLabel}>{progress}</Text>
      {label ? <Text style={styles.glowLabel}>{label}</Text> : null}
    </View>
  )
}
