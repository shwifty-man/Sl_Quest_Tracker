import { View, Text, TextInput, Pressable, StyleSheet } from "react-native"
import { useAuth } from "../../2_services/context"
import { useEffect, useState } from "react"
import { styles } from "../../2_services/styles"

const Register = ({ navigation }) => {
  const [email, setEmailValue] = useState("")
  const [password, setPasswordValue] = useState("")
  const { register, user } = useAuth()

  useEffect(() => {
    if (user) {
      console.log("User updated:", user)
    }
  }, [user])

  const handleRegister = async () => {
    try {
      await register({ email, password })
    } catch (err) {
      console.error("Register failed:", err)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Text
        style={styles.glowLabel}
        aria-label="Label for Email"
        nativeID="labelEmail"
      >
        Email
      </Text>

      <TextInput
        aria-labelledby="labelEmail"
        style={styles.input}
        value={email}
        onChangeText={setEmailValue}
      />

      <Text
        style={styles.glowLabel}
        aria-label="Label for Password"
        nativeID="labelPassword"
      >
        Password
      </Text>

      <TextInput
        aria-labelledby="labelPassword"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPasswordValue}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text>Register</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text>Login</Text>
      </Pressable>
    </View>
  )
}

export default Register
