// REQUIRED FOR OVERLAY: Syncs penalty state and restricted apps to the native side.
// AppWatcherService (native) is the single owner of showing/hiding the overlay;
// this file only feeds it state and handles the overlay permission.
import { NativeModules, Platform, AppState } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getActivePenalty } from "./penaltyUtils"
import { STORAGE_KEYS } from "./storage"

const { AppWatcherServiceModule, OverlayModule } = NativeModules

export let blockedApps = [] // package names
let appStateSubscription = null

const parseEndsAtMillis = (penalty) => {
  const raw = penalty?.ends_at || penalty?.endsAt || penalty?.endsAtIso
  if (!raw) return 0
  const millis = Date.parse(raw)
  return Number.isNaN(millis) ? 0 : millis
}

// Push the current penalty to native. On a failed fetch, keep the last known
// state instead of clearing it, so a network blip doesn't unblock apps.
const syncPenaltyState = async () => {
  if (!AppWatcherServiceModule) return

  const penalty = await getActivePenalty()
  if (penalty === null) return

  // When no penalty is active the backend returns a plain string
  const penaltyActive = penalty?.active === true
  AppWatcherServiceModule.setPenaltyEndsAtMillis?.(
    penaltyActive ? parseEndsAtMillis(penalty) : 0,
  )
  AppWatcherServiceModule.setPenaltyActive?.(penaltyActive)
}

export const getBlockedApps = () => blockedApps

// Replace the restricted app list (package names) and push it to native
const applyBlockedApps = (packages) => {
  blockedApps = [
    ...new Set(
      (packages || []).filter((pkg) => typeof pkg === "string" && pkg.length > 0),
    ),
  ]
  AppWatcherServiceModule?.setRestrictedApps?.(blockedApps)
  console.info(`[OVERLAY] Restricted apps synced (${blockedApps.length})`)
}

// Save the user's chosen apps so they survive app restarts
export const setBlockedApps = async (packages) => {
  applyBlockedApps(packages)
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BLOCKED_APPS, JSON.stringify(blockedApps))
  } catch (error) {
    console.warn("[OVERLAY] Failed to save blocked apps:", error)
  }
}

export const loadSavedBlockedApps = async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEYS.BLOCKED_APPS)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn("[OVERLAY] Failed to load blocked apps:", error)
    return []
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

// Start the AppWatcher service and sync state to it. Safe to call repeatedly.
export const startAppWatcherService = async () => {
  if (Platform.OS !== "android") return

  if (!AppWatcherServiceModule) {
    console.warn("[OVERLAY] App watcher module unavailable")
    return
  }

  AppWatcherServiceModule.startService()

  if (!(await checkOverlayPermission())) {
    console.warn("[OVERLAY] Permission missing; opening system settings")
    requestOverlayPermission()
  }

  // Prefer the user's saved selection; only auto-detect when nothing was ever chosen
  if (blockedApps.length === 0) {
    blockedApps = await loadSavedBlockedApps()
  }
  if (blockedApps.length === 0 && AppWatcherServiceModule.getEntertainmentApps) {
    try {
      const apps = await AppWatcherServiceModule.getEntertainmentApps()
      applyBlockedApps((apps || []).map((app) => app?.packageName))
    } catch (error) {
      console.warn("[OVERLAY] Failed to auto-load entertainment apps:", error)
    }
  } else {
    applyBlockedApps(blockedApps)
  }

  await syncPenaltyState()

  // Register once; re-sync whenever the app returns to the foreground
  if (!appStateSubscription) {
    appStateSubscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        syncPenaltyState()
      }
    })
  }
}
