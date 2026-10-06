import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"

import Register from "./src/1_screens/Auth/Register"
import Login from "./src/1_screens/Auth/Login"

import Home from "./src/1_screens/Home"

import { useAuth, useError, useUser } from "./src/2_services/context"

import CreateQuest from "./src/1_screens/Quest/QuestCreate"
import QuestsList from "./src/1_screens/Quest/AllQuest"
import QuestDetailPage from "./src/1_screens/Quest/QuestDetailPage"

import Profile from "./src/1_screens/User/Profile"
import Stats from "./src/1_screens/User/Stats"
import Shop from "./src/1_screens/User/Shop"

import Settings from "./src/1_screens/Utils/Settings"
import Inventory from "./src/1_screens/Utils/Inventory"
import BlockedApps from "./src/1_screens/Utils/BlockedApps"
import Intro from "./src/1_screens/Utils/Intro"

import ErrorOverlay from "./src/3_components/ErrorOverlay"
import ViewItem from "./src/3_components/ViewItem"

import { useFonts } from "@expo-google-fonts/orbitron"
import {
  Orbitron_400Regular,
  Orbitron_500Medium,
  Orbitron_700Bold,
} from "@expo-google-fonts/orbitron"


const Stack = createNativeStackNavigator()


function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  )
}


function SetupStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="BlockedApps" component={BlockedApps} />
    </Stack.Navigator>
  )
}


function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Stats" component={Stats} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="BlockedApps" component={BlockedApps} />
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="ViewItem" component={ViewItem} />
      <Stack.Screen name="Shop" component={Shop} />
      <Stack.Screen name="QuestCreate" component={CreateQuest} />
      <Stack.Screen name="QuestsList" component={QuestsList} />
      <Stack.Screen name="QuestDetails" component={QuestDetailPage} />
    </Stack.Navigator>
  )
}


function RootNavigator() {
  const { user, isLoading } = useAuth()
  const { setup, loadingForProfile } = useUser()
  const { error } = useError()

  const [fontsLoaded] = useFonts({
    Orbitron_400Regular,
    Orbitron_500Medium,
    Orbitron_700Bold,
  })


  /*
   * Wait until:
   * - Auth has finished loading
   * - User profile has finished loading
   * - Fonts have loaded
   */
  if (isLoading || setup === undefined || !fontsLoaded) {
    return null
  }


  console.log("ROOT NAVIGATION STATE:", {
    user,
    setup,
  })


  return (
    <>
      <ErrorOverlay error={error} />

      {!user ? (
        <AuthStack key="auth" />
      ) : setup === false ? (
        <SetupStack key="setup" />
      ) : (
        <AppStack key="app" />
      )}
    </>
  )
}


export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}