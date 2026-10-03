import { View, Text } from "react-native"
import { useEffect, useState } from "react"

import { styles } from "../../2_services/styles"
import { LinearGradient } from 'expo-linear-gradient';


const ProgressBar = ({ numOne, numTwo, showPercentage = false, time = false, exp = false, secondColor = '#62D5F8' }) => {
  const start = Number(numOne)
  const end = Number(numTwo)

  let progressPct;
  if (time) {

    const [now, setNow] = useState(Date.now())

    useEffect(() => {
      const interval = setInterval(() => {
        setNow(Date.now())
      }, 1000)

      return () => clearInterval(interval)
    }, [])

    progressPct = Math.min(100, Math.max(0.1, ((now - start) / (end - start)) * 100))
  }
  if (exp) {
    const currentExp = start;
    const currentLevel = end;

    const levelStartExp =
      currentLevel === 1
        ? 0
        : ((currentLevel - 1) * currentLevel / 2) * 100;

    const nextLevelExp =
      (currentLevel * (currentLevel + 1) / 2) * 100;

    progressPct =
      ((currentExp - levelStartExp) /
        (nextLevelExp - levelStartExp)) * 100;

    progressPct = Math.min(100, Math.max(0, progressPct));
  }
  return (
    <View style={styles.progressBarTrackWrapper}>
      <View style={styles.progressBarTrack}>
        <LinearGradient
          colors={['#2335D6', secondColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBarFill, { width: `${progressPct}%` }]}
        />
      </View>
      {showPercentage ? <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>{Math.floor(progressPct)}%</Text> : null}
    </View>
  )
}

export default ProgressBar
