// REQUIRED FOR OVERLAY: This file uses OverlayModule (native bridge) to show/hide overlay when penalties are active
import { NativeModules } from "react-native"

const { AppWatcherServiceModule } = NativeModules

export async function fetchEntertainmentApps() {
  try {
    return await AppWatcherServiceModule.getEntertainmentApps()
  } catch (err) {
    console.error("[overlay] Failed to load entertainment apps", err)
    throw err
  }
}
