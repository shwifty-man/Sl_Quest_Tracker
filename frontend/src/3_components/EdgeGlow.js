import { View } from "react-native"
import { styles } from "../2_services/styles"
import { LinearGradient } from "expo-linear-gradient"

const Edgeglow = () => {
  return (
    <View style={styles.edgeGlowContainer} pointerEvents="none">
      <LinearGradient
        colors={["rgba(20, 104, 215, 1)", "rgba(20, 104, 215, 0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.edgeGlowTop}
      />
      <LinearGradient
        colors={["rgba(20, 104, 215, 0)", "rgba(20, 104, 215, 1)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.edgeGlowBottom}
      />
      <LinearGradient
        colors={["rgba(20, 104, 215, 1)", "rgba(20, 104, 215, 0)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.edgeGlowLeft}
      />
      <LinearGradient
        colors={["rgba(20, 104, 215, 0)", "rgba(20, 104, 215, 1)"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.edgeGlowRight}
      />
    </View>
  )
}

export default Edgeglow
