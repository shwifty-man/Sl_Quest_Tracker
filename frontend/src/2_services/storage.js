import AsyncStorage from "@react-native-async-storage/async-storage"

export const STORAGE_KEYS = {
  TOKEN: "UserToken",
  USER: "User",
  QUESTS: "quests_cache",
  HUNTER_NAME_PREFIX: "hunter_name_",
  BLOCKED_APPS: "blocked_apps",
}

export async function setCachedQuests(quests) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests))
  } catch (err) {
    console.warn("[storage] Failed to cache quests", err)
    throw err
  }
}

export async function getCachedQuests() {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.QUESTS)
  return data ? JSON.parse(data) : []
}

export async function storeJWTToken(token) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token)
  } catch (err) {
    console.warn("[storage] Failed to store auth token", err)
    throw err
  }
}

export async function removeJWTToken() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN)
  } catch (err) {
    console.warn("[storage] Failed to remove auth token", err)
    throw err
  }
}

export async function storeUser(user) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  } catch (err) {
    console.warn("[storage] Failed to store user profile", err)
    throw err
  }
}

export async function removeUser() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER)
  } catch (err) {
    console.warn("[storage] Failed to remove user profile", err)
    throw err
  }
}
