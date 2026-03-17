import React, { useState } from "react"
import { View, Text, TextInput, Pressable } from "react-native"
import { fetchUpdateHunterName } from "../../4_api/user.api"
import { useAuth, useError, useUser } from "../../2_services/context"
import { styles } from "../../2_services/styles"

export default function Naming({ navigation }) {
  const [name, setName] = useState("")
  const { token } = useAuth()
  const { setHunterName, getUserProfile } = useUser()
  const { setError } = useError()

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) return

    setHunterName(trimmed)
    try {
      if (token) {
        await fetchUpdateHunterName(trimmed, token)
      }
      if (token) {
        await getUserProfile(token)
      }
    } catch (err) {
      console.error("[user] Failed to update hunter name", err)
      setError(err)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hunter Name:</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="words"
        autoCorrect={false}
        value={name}
        onChangeText={setName}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      {name.length > 5 ? (
        <Pressable onPress={handleSubmit}>
          <Text style={styles.title}>Submit</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
