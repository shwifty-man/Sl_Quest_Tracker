import { useEffect } from "react"
import { Text, View } from "react-native"
import { errStyles } from "../2_services/styles"
import { useError } from "../2_services/context"

export default function ErrorOverlay({ error, message }) {
  const { error: contextError, clearError } = useError()
  const resolvedError = error ?? contextError
  const text = message || resolvedError?.message || resolvedError

  useEffect(() => {
    if (!text) return
    const timer = setTimeout(() => {
      clearError()
    }, 3500)

    return () => clearTimeout(timer)
  }, [text, clearError])
  if (!text) return null

  return (
    <View style={errStyles.overlay} pointerEvents="none">
      <View style={errStyles.card}>
        <Text style={errStyles.text}>{String(text)}</Text>
      </View>
    </View>
  )
}
