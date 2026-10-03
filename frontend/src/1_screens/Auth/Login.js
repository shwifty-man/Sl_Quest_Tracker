import React, { useState } from "react"

import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ImageBackground
} from "react-native"

import { BlurView } from "expo-blur"
import backgroundImage from "../../../assets/auth_background.png"
import authStyles from "../../Styles/authStyles.js"
import { useAuth, useError } from "../../2_services/context"

const Login = ({ navigation }) => {
  const [emailValue, setEmailValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const { setError } = useError()

  const handleLogin = async () => {
    try {
      await login({
        email: emailValue,
        password: passwordValue,
      })
    } catch (err) {
      setError(err)
    }
  }

  const canLogin =
    emailValue.trim().length > 0 && passwordValue.length > 0

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#020814"
      />

      <ImageBackground
        source={backgroundImage}
        style={authStyles.background}
        resizeMode="cover"
      >

        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[authStyles.title, { fontSize: 30, marginBottom: 25 }]}>QuestTracker</Text>
          <BlurView
            intensity={45}
            tint="dark"
            style={authStyles.panel}
          >
            <View>
              <Text style={authStyles.title}>LOGIN</Text>

              <Text style={authStyles.subtitle}>
                Welcome back, Hunter.
              </Text>

              <View style={authStyles.form}>
                <Text style={authStyles.label}>
                  EMAIL OR USERNAME
                </Text>

                <TextInput
                  style={authStyles.input}
                  value={emailValue}
                  onChangeText={setEmailValue}
                  placeholder="Email or Username"
                  placeholderTextColor="#586985"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  selectionColor="#2A8CFF"
                />

                <Text style={authStyles.label}>
                  PASSWORD
                </Text>

                <View style={authStyles.passwordContainer}>
                  <TextInput
                    style={authStyles.passwordInput}
                    value={passwordValue}
                    onChangeText={setPasswordValue}
                    placeholder="Password"
                    placeholderTextColor="#586985"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    selectionColor="#2A8CFF"
                  />

                  <Pressable
                    style={authStyles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={authStyles.eyeText}>
                      {showPassword ? "◉" : "◌"}
                    </Text>
                  </Pressable>
                </View>

                <View style={authStyles.optionsRow}>
                  <Pressable>
                    <Text style={authStyles.forgotText}>
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  style={[
                    authStyles.loginButton,
                    !canLogin && authStyles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={!canLogin}
                >
                  <Text
                    style={[
                      authStyles.loginButtonText,
                      !canLogin && authStyles.loginButtonTextDisabled,
                    ]}
                  >
                    LOG IN
                  </Text>
                </Pressable>

                <View style={authStyles.bottomRow}>
                  <Text style={authStyles.bottomText}>
                    Don't have an account?
                  </Text>

                  <Pressable
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={authStyles.linkText}>
                      {" "}Sign up
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </BlurView>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Login