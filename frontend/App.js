import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Register from "./src/1_screens/Auth/Register"
import Login from "./src/1_screens/Auth/Login"
import Home from "./src/1_screens/Home"
import { useAuth } from "./src/2_services/context"
import CreateQuest from "./src/1_screens/Quest/QuestCreate"
import QuestsList from "./src/1_screens/Quest/AllQuest"
import QuestDetailPage from "./src/1_screens/Quest/ViewQuest"
import QuestDetailsView from "./src/3_components/QuestDetailsView"

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
      <Stack.Screen name="QuestCreate" component={CreateQuest} />
      <Stack.Screen name="QuestsList" component={QuestsList} />
      <Stack.Screen name="QuestDetails" component={QuestDetailPage} />
      <Stack.Screen name="QuestDetailsView" component={QuestDetailsView} />
    </Stack.Navigator>
  )
}

function RootNavigator() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null // or splash screen

  return user ? <AppStack /> : <AuthStack />
}

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}
