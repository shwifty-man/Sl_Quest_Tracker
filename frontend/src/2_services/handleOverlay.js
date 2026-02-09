// REQUIRED FOR OVERLAY: This file uses OverlayModule (native bridge) to show/hide overlay when penalties are active
import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  AppState,
} from "react-native"
import { isAnyPenaltyActive } from "./penaltyUtils"

const { AppWatcherServiceModule, OverlayModule } = NativeModules

console.log("=== OVERLAY MODULE DEBUG ===")
console.log("OverlayModule exists:", !!OverlayModule)
console.log(
  "OverlayModule methods:",
  OverlayModule ? Object.keys(OverlayModule) : "null",
)
console.log("===========================")

const blockedApps = ["app.revanced.android.youtube"]
let eventListener = null
let emitter = null
let currentOverlayApp = null // Track which app currently has overlay displayed
let currentPackageName = null
let appChangeSeq = 0

// Function to manually close overlay (called when user taps close button)
export const closeOverlay = () => {
  if (OverlayModule && currentOverlayApp !== null) {
    console.log("[OVERLAY-CLOSE] User closed overlay manually")
    OverlayModule.hideOverlay()
    currentOverlayApp = null
  }
}

// Check if overlay permission is granted
export const checkOverlayPermission = async () => {
  if (!OverlayModule) {
    console.error("OverlayModule not available")
    return false
  }

  try {
    const hasPermission = await OverlayModule.checkOverlayPermission()
    console.log("Overlay permission status:", hasPermission)
    return hasPermission
  } catch (error) {
    console.error("Error checking overlay permission:", error)
    return false
  }
}

// Request overlay permission
export const requestOverlayPermission = () => {
  if (!OverlayModule) {
    console.error("OverlayModule not available")
    return
  }

  try {
    OverlayModule.requestOverlayPermission()
  } catch (error) {
    console.error("Error requesting overlay permission:", error)
  }
}

// Set up the native event listener
const setupEventListener = () => {
  if (!AppWatcherServiceModule) {
    console.warn("AppWatcherServiceModule not available")
    return
  }

  // Remove previous listener if it exists
  if (eventListener) {
    eventListener.remove()
  }

  emitter = new NativeEventEmitter(AppWatcherServiceModule)
  eventListener = emitter.addListener("onAppChanged", ({ packageName }) => {
    console.log("App changed event:", packageName)
    onAppChanged(packageName)
  })
}

// Start the AppWatcher service and listener
export const startAppWatcherService = async () => {
  if (!AppWatcherServiceModule) {
    console.warn("AppWatcherServiceModule not available")
    return
  }

  if (Platform.OS === "android") {
    AppWatcherServiceModule.startService()

    // Initial listener setup
    setupEventListener()

    // Re-establish listener when app state changes
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        setupEventListener()
      } else {
        if (OverlayModule && currentOverlayApp !== null) {
          console.log("[OVERLAY-HIDE] App inactive/background - hiding overlay")
          try {
            OverlayModule.hideOverlay()
            currentOverlayApp = null
          } catch (error) {
            console.error("[OVERLAY-ERROR] Failed to hide overlay:", error)
          }
        }
      }
    })

    return () => {
      subscription.remove()
      if (eventListener) {
        eventListener.remove()
      }
    }
  }
}

// Handle app change events
export const onAppChanged = async (packageName) => {
  const seq = ++appChangeSeq
  currentPackageName = packageName

  if (!packageName) {
    if (OverlayModule && currentOverlayApp !== null) {
      console.log("[OVERLAY-HIDE] No package name - hiding overlay")
      try {
        OverlayModule.hideOverlay()
        currentOverlayApp = null
      } catch (error) {
        console.error("[OVERLAY-ERROR] Failed to hide overlay:", error)
      }
    }
    return
  }

  // Check if OverlayModule is available
  if (!OverlayModule) {
    console.error(
      "OverlayModule is not available! Check native module registration.",
    )
    return
  }

  const penaltyActive = await isAnyPenaltyActive()
  if (seq !== appChangeSeq || currentPackageName !== packageName) {
    console.log(
      "[APP-CHANGE] Stale app change ignored:",
      packageName,
      "| current:",
      currentPackageName,
    )
    return
  }
  console.log(
    "[APP-CHANGE] Package:",
    packageName,
    "| Penalty:",
    penaltyActive,
    "| Current Overlay:",
    currentOverlayApp,
  )

  // If current app is blocked and penalty is active, show overlay (always show on blocked app)
  if (penaltyActive && blockedApps.includes(packageName)) {
    // Always show overlay when opening a blocked app with active penalty
    console.log("[OVERLAY-SHOW] Showing overlay for:", packageName)
    console.log("[OVERLAY-SHOW] OverlayModule available:", !!OverlayModule)
    console.log(
      "[OVERLAY-SHOW] showOverlay method:",
      typeof OverlayModule?.showOverlay,
    )
    try {
      const result = OverlayModule.showOverlay()
      currentOverlayApp = packageName
      console.log("[OVERLAY-SHOW] Success! Result:", result)
    } catch (error) {
      console.error("[OVERLAY-ERROR] Failed to show overlay:", error)
      console.error("[OVERLAY-ERROR] Error message:", error.message)
      console.error("[OVERLAY-ERROR] Error stack:", error.stack)
    }
  } else if (!penaltyActive || !blockedApps.includes(packageName)) {
    // Hide overlay when:
    // 1. Penalty is no longer active, OR
    // 2. User switched to any non-blocked app (including launcher/home)
    const shouldHide = !penaltyActive || !blockedApps.includes(packageName)
    console.log(
      "[OVERLAY-DEBUG] Hide check - Penalty:",
      penaltyActive,
      "| isBlocked:",
      blockedApps.includes(packageName),
      "| shouldHide:",
      shouldHide,
      "| currentOverlayApp:",
      currentOverlayApp,
    )
    if (currentOverlayApp !== null) {
      console.log(
        "[OVERLAY-HIDE] Hiding overlay. Penalty:",
        penaltyActive,
        "| App:",
        packageName,
      )
      try {
        OverlayModule.hideOverlay()
        currentOverlayApp = null
        console.log("[OVERLAY-HIDE] Success!")
      } catch (error) {
        console.error("[OVERLAY-ERROR] Failed to hide overlay:", error)
      }
    }
  }
}
