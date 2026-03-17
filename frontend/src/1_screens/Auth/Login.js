import { View, Text, TextInput, Pressable } from "react-native"
import { useAuth, useError } from "../../2_services/context"
import { useState } from "react"
import { styles } from "../../2_services/styles"

const Login = ({ navigation }) => {
  const [emailValue, setEmailValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const { login, user } = useAuth()
  const { setError } = useError()

  const handleLogin = async () => {
    try {
      await login({ email: emailValue, password: passwordValue })
    } catch (err) {
      setError(err)
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
      {emailValue ? (
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text>Login</Text>
        </Pressable>
      ) : null}

      {emailValue.length < 1 ? (
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text>Register</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export default Login
