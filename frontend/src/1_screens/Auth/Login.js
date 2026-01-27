import { View, Text, TextInput, Pressable } from "react-native"
import { useAuth } from "../../2_services/context"
import { useEffect, useState } from "react"
import { styles } from "../../2_services/styles"

const Login = ({ navigation }) => {
  const [emailValue, setEmailValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const { login, user } = useAuth()

  useEffect(() => {
    if (user) {
      console.log("User updated:", user)
    }
  }, [user])

  const handleLogin = async () => {
    try {
      await login({ email: emailValue, password: passwordValue })
    } catch (err) {
      throw new Error("Login failed:", err)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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
        value={emailValue}
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
        value={passwordValue}
        onChangeText={setPasswordValue}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text>Login</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text>Register</Text>
      </Pressable>
    </View>
  )
}

export default Login
