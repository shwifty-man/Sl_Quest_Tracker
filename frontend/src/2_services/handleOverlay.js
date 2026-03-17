// REQUIRED FOR OVERLAY: This file uses OverlayModule (native bridge) to show/hide overlay when penalties are active
import {
  NativeModules,
  Platform,
  NativeEventEmitter,
  AppState,
} from "react-native"
import { getActivePenalty, isAnyPenaltyActive } from "./penaltyUtils"

const { AppWatcherServiceModule, OverlayModule } = NativeModules

let blockedApps = []
let eventListener = null
let emitter = null
let currentOverlayApp = null // Track which app currently has overlay displayed
let currentPackageName = null
let penaltyPollInterval = null

const updateOverlayForPenalty = async (penaltyActive, endsAtMillis) => {
  if (!OverlayModule) return
  if (!currentPackageName) return

  const isBlocked = blockedApps.includes(currentPackageName)

  if (penaltyActive && isBlocked) {
    if (currentOverlayApp !== currentPackageName) {
      try {
        const hasPermission = await OverlayModule.checkOverlayPermission()
        if (!hasPermission) {
          console.warn("[OVERLAY] Permission missing; opening system settings")
          OverlayModule.requestOverlayPermission()
          return
        }
        if (endsAtMillis > 0 && OverlayModule?.showOverlayWithEndsAtMillis) {
          OverlayModule.showOverlayWithEndsAtMillis(endsAtMillis)
        } else {
          OverlayModule.showOverlay()
        }
        currentOverlayApp = currentPackageName
      } catch (error) {
        console.error("[OVERLAY] Failed to show overlay", error)
      }
    }
    return
  }

  if (!penaltyActive || !isBlocked) {
    if (currentOverlayApp !== null) {
      try {
        OverlayModule.hideOverlay()
        currentOverlayApp = null
      } catch (error) {
        console.error("[OVERLAY] Failed to hide overlay", error)
      }
    }
  }
}

const parseEndsAtMillis = (penalty) => {
  const raw = penalty?.ends_at || penalty?.endsAt || penalty?.endsAtIso
  if (!raw) return 0
  const millis = Date.parse(raw)
  return Number.isNaN(millis) ? 0 : millis
}

const syncPenaltyState = async () => {
  try {
    const penalty = await getActivePenalty()
    const penaltyActive = penalty?.active === true
    const endsAtMillis = parseEndsAtMillis(penalty)
    if (AppWatcherServiceModule?.setPenaltyEndsAtMillis) {
      AppWatcherServiceModule.setPenaltyEndsAtMillis(endsAtMillis)
    }
    if (AppWatcherServiceModule?.setPenaltyActive) {
      AppWatcherServiceModule.setPenaltyActive(!!penaltyActive)
    }
    return penaltyActive
  } catch (error) {
    console.warn("[OVERLAY] Failed to sync penalty state:", error)
    if (AppWatcherServiceModule?.setPenaltyActive) {
      AppWatcherServiceModule.setPenaltyActive(false)
    }
    if (AppWatcherServiceModule?.setPenaltyEndsAtMillis) {
      AppWatcherServiceModule.setPenaltyEndsAtMillis(0)
    }
    return false
  }
}

// Function to manually close overlay (called when user taps close button)
export const closeOverlay = () => {
  if (OverlayModule && currentOverlayApp !== null) {
    console.info("[OVERLAY] Overlay dismissed by user")
    OverlayModule.hideOverlay()
    currentOverlayApp = null
  }
}

// Check if overlay permission is granted
export const checkOverlayPermission = async () => {
  if (!OverlayModule) {
    console.warn("[OVERLAY] Native overlay module unavailable")
    return false
  }

  try {
    return await OverlayModule.checkOverlayPermission()
  } catch (error) {
    console.error("[OVERLAY] Failed to check overlay permission", error)
    return false
  }
}

// Request overlay permission
export const requestOverlayPermission = () => {
  if (!OverlayModule) {
    console.warn("[OVERLAY] Native overlay module unavailable")
    return
  }

  try {
    OverlayModule.requestOverlayPermission()
  } catch (error) {
    console.error("[OVERLAY] Failed to request overlay permission", error)
  }
}

// Set up the native event listener
const setupEventListener = () => {
  if (!AppWatcherServiceModule) {
    console.warn("[OVERLAY] App watcher module unavailable")
    return
  }

  // Remove previous listener if it exists
  if (eventListener) {
    eventListener.remove()
  }

  emitter = new NativeEventEmitter(AppWatcherServiceModule)
  eventListener = emitter.addListener("onAppChanged", ({ packageName }) => {
    onAppChanged(packageName)
  })
}

// Start the AppWatcher service and listener
export const startAppWatcherService = async () => {
  if (!AppWatcherServiceModule) {
    console.warn("[OVERLAY] App watcher module unavailable")
    return
  }

  if (Platform.OS === "android") {
    AppWatcherServiceModule.startService()

    if (AppWatcherServiceModule?.getEntertainmentApps) {
      try {
        const apps = await AppWatcherServiceModule.getEntertainmentApps()
        const packages = (apps || [])
          .map((app) => app?.packageName)
          .filter((pkg) => typeof pkg === "string" && pkg.length > 0)

        if (packages.length > 0) {
          blockedApps = [...new Set(packages)]
          console.info(`[OVERLAY] Loaded ${blockedApps.length} restricted apps`)
        }
      } catch (error) {
        console.warn("[OVERLAY] Failed to auto-load entertainment apps:", error)
      }
    }

    if (AppWatcherServiceModule.setRestrictedApps) {
      AppWatcherServiceModule.setRestrictedApps(blockedApps)
      console.info(`[OVERLAY] Restricted apps synced (${blockedApps.length})`)
    }

    await syncPenaltyState()

    if (AppWatcherServiceModule?.getForegroundApp) {
      try {
        const pkg = await AppWatcherServiceModule.getForegroundApp()
        if (pkg) {
          currentPackageName = pkg
          await onAppChanged(pkg)
        }
      } catch (error) {
        console.warn("[OVERLAY] Failed to read foreground app:", error)
      }
    }

    if (penaltyPollInterval) {
      clearInterval(penaltyPollInterval)
    }
    penaltyPollInterval = setInterval(async () => {
      const penalty = await getActivePenalty()
      const penaltyActive = penalty?.active === true
      const endsAtMillis = parseEndsAtMillis(penalty)
      if (AppWatcherServiceModule?.getForegroundApp) {
        try {
          const pkg = await AppWatcherServiceModule.getForegroundApp()
          if (pkg) currentPackageName = pkg
        } catch (error) {
          console.warn("[OVERLAY] Failed to read foreground app:", error)
        }
      }
      await updateOverlayForPenalty(penaltyActive, endsAtMillis)
      if (AppWatcherServiceModule?.setPenaltyActive) {
        AppWatcherServiceModule.setPenaltyActive(!!penaltyActive)
      }
      if (AppWatcherServiceModule?.setPenaltyEndsAtMillis) {
        AppWatcherServiceModule.setPenaltyEndsAtMillis(endsAtMillis)
      }
    }, 15000)

    // Initial listener setup
    setupEventListener()

    // Re-establish listener when app state changes
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        setupEventListener()
        syncPenaltyState()
      } else {
        if (OverlayModule && currentOverlayApp !== null) {
          console.info("[OVERLAY] Hiding overlay while app is backgrounded")
          try {
            OverlayModule.hideOverlay()
            currentOverlayApp = null
          } catch (error) {
            console.error("[OVERLAY] Failed to hide overlay", error)
          }
        }
      }
    })

    return () => {
      subscription.remove()
      if (eventListener) {
        eventListener.remove()
      }
      if (penaltyPollInterval) {
        clearInterval(penaltyPollInterval)
        penaltyPollInterval = null
      }
    }
  }
}

// Handle app change events
export const onAppChanged = async (packageName) => {
  currentPackageName = packageName

  if (!packageName) {
    if (OverlayModule && currentOverlayApp !== null) {
      try {
        OverlayModule.hideOverlay()
        currentOverlayApp = null
      } catch (error) {
        console.error("[OVERLAY] Failed to hide overlay", error)
      }
    }
    return
  }

  // Check if OverlayModule is available
  if (!OverlayModule) {
    console.error("[OVERLAY] Native overlay module unavailable")
    return
  }

  const penalty = await getActivePenalty()
  const penaltyActive = penalty?.active === true
  const endsAtMillis = parseEndsAtMillis(penalty)
  if (AppWatcherServiceModule?.setPenaltyEndsAtMillis) {
    AppWatcherServiceModule.setPenaltyEndsAtMillis(endsAtMillis)
  }
  if (AppWatcherServiceModule?.setPenaltyActive) {
    AppWatcherServiceModule.setPenaltyActive(!!penaltyActive)
  }
  if (currentPackageName !== packageName) {
    return
  }

  await updateOverlayForPenalty(penaltyActive, endsAtMillis)
}
