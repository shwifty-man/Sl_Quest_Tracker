import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"

import {
  fetchUserInventory,
  fetchUserProfile,
  fetchUserSetup,
  fetchUserShop,
} from "../4_api/user.api"

import { AuthContext } from "./AuthProvider"
import { ErrorContext } from "./ErrorProvider"

export const UserContext = createContext()


export function UserProvider({ children }) {

  const [hunterName, setHunterName] = useState(null)
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(null)
  const [weekly, setWeekly] = useState(null)
  const [progress, setProgress] = useState(null)
  const [coins, setCoins] = useState(null)

  const [inventory, setInventory] = useState(null)
  const [shop, setShop] = useState(null)

  const [setup, setSetupState] = useState(undefined)

  const [loadingForProfile, setLoadingForProfile] = useState(false)

  const { token } = useContext(AuthContext)
  const { setError } = useContext(ErrorContext)


  const getUserProfile = useCallback(
    async (activeToken) => {
      try {
        setLoadingForProfile(true)

        const effectiveToken = activeToken || token

        console.log("GET USER PROFILE CALLED:", effectiveToken)

        if (!effectiveToken) return

        const profile = await fetchUserProfile(effectiveToken)

        console.log("USER PROFILE:", profile)

        setHunterName(profile.hunterName.username)
        setStats(profile.stats)
        setStreak(profile.streak)
        setWeekly(profile.weekly)
        setProgress(profile.progress)
        setCoins(profile.progress.coins)

        const profileSetup = profile.setup ?? profile.set_up

        console.log("PROFILE SETUP:", profileSetup)

        if (profileSetup !== undefined) {
          setSetupState(Boolean(profileSetup))
        }

      } catch (err) {
        setError(err?.message || "Unable to load profile.")
        throw err
      } finally {
        setLoadingForProfile(false)
      }
    },
    [token],
  )

  const setSetup = useCallback(
    async (activeToken) => {
      try {
        const effectiveToken = activeToken || token

        if (!effectiveToken) return false

        const results = await fetchUserSetup(effectiveToken)

        console.log("fetchUserSetup results:", results)

        // Handles:
        // true
        // false
        // { setup_complete: true }
        // { set_up: true }
        const newSetup =
          typeof results === "boolean"
            ? results
            : Boolean(results?.setup_complete ?? results?.set_up)

        setSetupState(newSetup)

        console.log("SETUP STATE UPDATED:", newSetup)

        return newSetup

      } catch (err) {
        setError(err?.message || "Unable to update setup.")
        throw err
      }
    },
    [token],
  )

  const getUserInventory = useCallback(
    async () => {
      try {
        if (!token) return

        const userInventory = await fetchUserInventory(token)
        console.log("Inventory: ", userInventory)
        setInventory(userInventory)

      } catch (err) {
        console.error("GET INVENTORY ERROR:", err)
        throw err
      }
    },
    [token],
  )

  const getUserShop = useCallback(
    async () => {
      try {
        if (!token) return

        const userShop = await fetchUserShop(token)

        setShop(userShop)

      } catch (err) {
        console.error("GET SHOP ERROR:", err)
        throw err
      }
    },
    [token],
  )

  useEffect(() => {

    if (!token) return

    let cancelled = false

    async function loadUserData() {
      try {
        setLoadingForProfile(true)

        const [
          profile,
          userInventory,
          userShop,
        ] = await Promise.all([
          fetchUserProfile(token),
          fetchUserInventory(token),
          fetchUserShop(token),
        ])

        if (cancelled) return

        console.log("USER PROFILE:", profile)

        setHunterName(profile.hunterName.username)
        setStats(profile.stats)
        setStreak(profile.streak)
        setWeekly(profile.weekly)
        setProgress(profile.progress)
        setCoins(profile.progress.coins)

        const profileSetup = profile.setup ?? profile.set_up

        console.log("PROFILE SETUP:", profileSetup)

        if (profileSetup !== undefined) {
          setSetupState(Boolean(profileSetup))
        }

        setInventory(userInventory)
        setShop(userShop)

      } catch (err) {
        if (!cancelled) {
          console.error("LOAD USER DATA ERROR:", err)
          setError(err?.message || "Unable to load user data.")
        }
      } finally {
        if (!cancelled) {
          setLoadingForProfile(false)
        }
      }
    }

    loadUserData()

    return () => {
      cancelled = true
    }

  }, [token])


  return (
    <UserContext.Provider
      value={{
        hunterName,
        setHunterName,

        stats,

        streak,
        weekly,

        progress,

        loadingForProfile,

        coins,

        inventory,
        shop,

        setup,

        setSetup,

        getUserProfile,
        getUserInventory,
        getUserShop,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}