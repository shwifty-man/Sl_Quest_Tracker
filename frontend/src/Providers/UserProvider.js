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
  fetchUserShop,
} from "../4_api/user.api"
import { useAuth } from "../2_services/context"
import { ErrorContext } from "./ErrorProvider"

export const UserContext = createContext()

export function UserProvider({ children }) {
  const [hunterName, setHunterName] = useState(null)
  const [stats, setStats] = useState(null)
  const [progress, setProgress] = useState(null)
  const [badge, setBadgeObject] = useState(null)
  const [coins, setCoins] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [shop, setShop] = useState(null)
  const [loadingForProfile, setLoadingForProfile] = useState(false)
  const { token } = useAuth()
  const { setError } = useContext(ErrorContext)

  const getUserProfile = useCallback(
    async (activeToken) => {
      try {
        setLoadingForProfile(true)
        const effectiveToken = activeToken || token
        if (!effectiveToken) return
        const profile = await fetchUserProfile(effectiveToken)
        setHunterName(profile.hunterName.username)
        setStats(profile.stats)
        setProgress(profile.progress)
        setBadgeObject(profile.badge)
        setCoins(profile.progress.coins)
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoadingForProfile(false)
      }
    },
    [token],
  )

  const getUserInventory = useCallback(async () => {
    try {
      if (!token) return
      const userInventory = await fetchUserInventory(token)
      setInventory(userInventory)
    } catch (err) {
      throw err
    }
  }, [token])

  const getUserShop = useCallback(async () => {
    try {
      if (!token) return
      const userShop = await fetchUserShop(token)
      setShop(userShop)
    } catch (err) {
      throw err
    }
  }, [token])

  useEffect(() => {
    if (!token) return
    getUserProfile(token).catch(() => {})
    getUserInventory()
    getUserShop()
  }, [token, getUserProfile, getUserInventory, getUserShop])

  return (
    <UserContext.Provider
      value={{
        hunterName,
        setHunterName,
        stats,
        progress,
        loadingForProfile,
        badge,
        coins,
        inventory,
        shop,
        getUserProfile,
        getUserInventory,
        getUserShop,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
