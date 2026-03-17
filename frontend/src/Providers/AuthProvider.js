import React, { createContext, useState, useEffect, useContext } from "react"
import { NativeModules } from "react-native"
import { fetchLogin, fetchRegister } from "../4_api/auth.api"
import {
  removeJWTToken,
  removeUser,
  STORAGE_KEYS,
  storeJWTToken,
  storeUser,
} from "../2_services/storage"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DevSettings } from "react-native"
import { ErrorContext } from "./ErrorProvider"

// 1. Create the context
export const AuthContext = createContext()

// 2. Create the provider component
export function AuthProvider({ children }) {
  // 2a. State for user, token, and loading
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setError } = useContext(ErrorContext)

  // 2b. Function: login
  const login = async (credentials) => {
    // call backend, get token & user, update state
    setIsLoading(true)
    try {
      // Send request to backend to login user
      const data = await fetchLogin(credentials)

      if (!data || !data.user || !data.token) {
        console.error("Invalid login data:", data)
        return
      }

      // Set user and token
      setUser(data.user)
      setToken(data.token)

      // Store the token and user
      await storeJWTToken(data.token)
      await storeUser(data.user)
    } catch (err) {
      setError(err)
      throw new Error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // 2c. Function: Register
  const register = async (data) => {
    // call backend, get token & user, update state
    try {
      const registerData = await fetchRegister(data)

      if (!registerData || !registerData.user || !registerData.token) {
        console.error("[auth] Invalid register response", registerData)
        return
      }

      setUser(registerData.user)
      setToken(registerData.token)

      await storeJWTToken(registerData.token)
      await storeUser(registerData.user)
    } catch (err) {
      setError(err)
      throw new Error(err)
    }
  }

  // 2c. Function: logout
  const logout = async () => {
    // clear token & user
    await removeJWTToken()
    await removeUser()
    DevSettings.reload()
  }

  // 2d. Function: restoreSession
  const restoreSession = async () => {
    // read token from storage, validate, update state
    try {
      const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN)
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER)

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.error("[auth] Failed to restore session", err)
    } finally {
      setIsLoading(false)
    }
  }

  // 2e. Run restoreSession once on mount
  useEffect(() => {
    restoreSession()
  }, [])

  useEffect(() => {
    const module = NativeModules?.AppWatcherServiceModule
    if (module?.setBackendUrl && process.env.EXPO_PUBLIC_BACKEND_URL) {
      module.setBackendUrl(process.env.EXPO_PUBLIC_BACKEND_URL)
    }
    if (module?.setAuthToken) {
      module.setAuthToken(token || "")
    }
  }, [token])

  // 3. Provide state & actions to children
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
