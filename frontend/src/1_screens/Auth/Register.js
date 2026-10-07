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

import { MaterialCommunityIcons } from "@expo/vector-icons"

import { BlurView } from "expo-blur"
import backgroundImage from '../../../assets/auth_background.png'
import { useAuth, useError } from "../../2_services/context"
import authStyles from '../../Styles/authStyles.js'

const Register = ({ navigation }) => {

  const [username, setUsername] = useState("")
  const [email, setEmailValue] = useState("")
  const [password, setPasswordValue] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { register } = useAuth()
  const { setError } = useError()

  const handleRegister = async () => {

    if (!username.trim() || !email.trim() || !password) {
      return
    }

    try {
      await register({
        name: username.trim(),
        email: email.trim(),
        password,
      })
    } catch (err) {
      console.error("[auth] Register failed", err)
      setError(err)
    }
  }

  const canRegister =
    username.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 8

  return (
    <KeyboardAvoidingView
      style={authStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <StatusBar
        barStyle="light-content"
        backgroundColor="#020914"
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

              <Text style={authStyles.title}>REGISTER</Text>

              <Text style={authStyles.subtitle}>
                Create your account.
              </Text>

              <View style={authStyles.form}>

                <Text style={authStyles.label}>USERNAME</Text>

                <TextInput
                  style={authStyles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor="#66738F"
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor="#2A8CFF"
                />

                <Text style={authStyles.label}>EMAIL</Text>

                <TextInput
                  style={authStyles.input}
                  value={email}
                  onChangeText={setEmailValue}
                  placeholder="Email"
                  placeholderTextColor="#66738F"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  selectionColor="#2A8CFF"
                />

                <Text style={authStyles.label}>PASSWORD</Text>

                <View style={authStyles.passwordContainer}>

                  <TextInput
                    style={authStyles.passwordInput}
                    value={password}
                    onChangeText={setPasswordValue}
                    placeholder="Password"
                    placeholderTextColor="#66738F"
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

                <View style={{ marginBottom: 10 }}>
                  <View style={authStyles.passwordRule}>
                    <MaterialCommunityIcons
                      name={password.length >= 8 ? "check-circle" : "circle-outline"}
                      size={18}
                      color={password.length >= 8 ? "#5EA7FF" : "#434966"}
                    />
                    <Text style={authStyles.passwordRuleText}>
                      At least 8 characters
                    </Text>
                  </View>

                  <View style={authStyles.passwordRule}>
                    <MaterialCommunityIcons
                      name={/[A-Z]/.test(password) ? "check-circle" : "circle-outline"}
                      size={18}
                      color={/[A-Z]/.test(password) ? "#5EA7FF" : "#434966"}
                    />
                    <Text style={authStyles.passwordRuleText}>
                      One uppercase letter
                    </Text>
                  </View>

                  <View style={authStyles.passwordRule}>
                    <MaterialCommunityIcons
                      name={/[a-z]/.test(password) ? "check-circle" : "circle-outline"}
                      size={18}
                      color={/[a-z]/.test(password) ? "#5EA7FF" : "#434966"}
                    />
                    <Text style={authStyles.passwordRuleText}>
                      One lowercase letter
                    </Text>
                  </View>

                  <View style={authStyles.passwordRule}>
                    <MaterialCommunityIcons
                      name={/\d/.test(password) ? "check-circle" : "circle-outline"}
                      size={18}
                      color={/\d/.test(password) ? "#5EA7FF" : "#434966"}
                    />
                    <Text style={authStyles.passwordRuleText}>
                      One number
                    </Text>
                  </View>

                  <View style={authStyles.passwordRule}>
                    <MaterialCommunityIcons
                      name={/[^A-Za-z0-9]/.test(password) ? "check-circle" : "circle-outline"}
                      size={18}
                      color={/[^A-Za-z0-9]/.test(password) ? "#5EA7FF" : "#434966"}
                    />
                    <Text style={authStyles.passwordRuleText}>
                      One special character
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={[
                    authStyles.registerButton,
                    !canRegister && authStyles.registerButtonDisabled,
                  ]}
                  onPress={handleRegister}
                  disabled={!canRegister}
                >

                  <Text
                    style={[
                      authStyles.registerButtonText,
                      !canRegister &&
                      authStyles.registerButtonTextDisabled,
                    ]}
                  >
                    CREATE ACCOUNT
                  </Text>

                </Pressable>

                <View style={authStyles.bottomRow}>

                  <Text style={authStyles.bottomText}>
                    Already have an account?
                  </Text>

                  <Pressable
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={authStyles.linkText}>
                      {" "}Log in
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

export default Register