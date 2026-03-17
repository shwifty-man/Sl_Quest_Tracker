import { View } from "react-native"
import { styles } from "../2_services/styles"

const ProgressBar = ({ currentExp, level }) => {
  const levelNum = Number(level)
  const expNum = Number(currentExp)
  const safeLevel = Number.isFinite(levelNum) && levelNum > 0 ? levelNum : 1
  const safeExp = Number.isFinite(expNum) && expNum >= 0 ? expNum : 0
  const nextLevelExp = safeLevel * 100
  const progressPct = Math.min(
    100,
    Math.max(0.5, (currentExp / nextLevelExp) * 100),
  )

  return (
    <View style={styles.progressBarTrack}>
      <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
    </View>
  )
}

export default ProgressBar
