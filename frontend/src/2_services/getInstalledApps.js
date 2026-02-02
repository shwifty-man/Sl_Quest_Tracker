import { NativeModules, Platform } from "react-native"

const { AppWatcherServiceModule } = NativeModules

export const startAppWatcherService = () => {
  if (!AppWatcherServiceModule) {
    console.warn("AppWatcherServiceModule not available")
    return
  }
  if (Platform.OS === "android" && AppWatcherServiceModule) {
    AppWatcherServiceModule.startService()
  }
}

export const getCurrentApp = async () => {
  if (!AppWatcherServiceModule) {
    console.warn("AppWatcherServiceModule not available")
    return null
  }
  if (Platform.OS === "android" && AppWatcherServiceModule) {
    try {
      const app = await AppWatcherServiceModule.getForegroundApp()
      console.log("Current foreground app:", app)
      return app
    } catch (err) {
      console.warn("Failed to get foreground app:", err)
      return null
    }
  }
  return null
}
