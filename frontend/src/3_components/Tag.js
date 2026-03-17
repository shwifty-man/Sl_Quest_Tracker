import { View, Text } from "react-native"
import { questInfoStyles, text } from "../2_services/styles"

export default function Tag({ label = "INFO" }) {
  const displayText = label
  return (
    <View style={questInfoStyles.container}>
      <View style={questInfoStyles.levelBox}>
        <View style={questInfoStyles.levelCircle}>
          <Text style={questInfoStyles.levelText}>!</Text>
        </View>
      </View>
      <View style={questInfoStyles.labelBox}>
        <Text
          numberOfLines={1}
          style={[text.name, { fontSize: 18, textAlign: "center", }]}
        >
          {String(displayText)}
        </Text>
      </View>
    </View>
  )
}
