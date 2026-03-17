import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Register from "./src/1_screens/Auth/Register"
import Login from "./src/1_screens/Auth/Login"
import Home from "./src/1_screens/Home"
import { useAuth, useError, useUser } from "./src/2_services/context"
import CreateQuest from "./src/1_screens/Quest/QuestCreate"
import QuestsList from "./src/1_screens/Quest/AllQuest"
import QuestDetailPage from "./src/1_screens/Quest/ViewQuest"
import QuestDetailsView from "./src/3_components/QuestDetailsView"
import Naming from "./src/1_screens/User/Naming"
import Stats from "./src/1_screens/User/Stats"
import Inventory from "./src/1_screens/User/Inventory"
import ErrorOverlay from "./src/3_components/ErrorOverlay"
import ViewItem from "./src/3_components/ViewItem"
import Settings from "./src/1_screens/Settings"

const Stack = createNativeStackNavigator()

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  )
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Stats" component={Stats} />
      <Stack.Screen name="Inventory" component={Inventory} />
      <Stack.Screen name="ViewItem" component={ViewItem} />
      <Stack.Screen name="QuestCreate" component={CreateQuest} />
      <Stack.Screen name="QuestsList" component={QuestsList} />
      <Stack.Screen name="QuestDetails" component={QuestDetailPage} />
      <Stack.Screen name="QuestDetailsView" component={QuestDetailsView} />
    </Stack.Navigator>
  )
}

function NamingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Naming" component={Naming} />
    </Stack.Navigator>
  )
}

function RootNavigator() {
  const { user, isLoading } = useAuth()
  const { hunterName, loadingForProfile } = useUser()
  const { error } = useError()
  const hunterNameString =
    typeof hunterName === "string"
      ? hunterName
      : hunterName?.username
        ? String(hunterName.username)
        : hunterName
          ? String(hunterName)
          : ""
  const hasHunterName = Boolean(hunterNameString.trim())
  const needsNaming = Boolean(user && !hasHunterName)
  const isBootLoading = Boolean(
    isLoading || (user && !hasHunterName && loadingForProfile),
  )

  if (isBootLoading) return null // or splash screen

  return (
    <>
      <ErrorOverlay error={error} />
      {user ? needsNaming ? <NamingStack /> : <AppStack /> : <AuthStack />}
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
