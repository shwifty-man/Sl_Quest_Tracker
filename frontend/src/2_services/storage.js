import AsyncStorage from "@react-native-async-storage/async-storage"


export const STORAGE_KEYS = {
  TOKEN: "UserToken",
  USER: "User",
  QUESTS: "quests_cache",
}

export async function setCachedQuests(quests) {
  await AsyncStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests))
  console.log("Stored Quest")
}

export async function getCachedQuests() {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.QUESTS)
  return data ? JSON.parse(data) : []
}


export async function storeJWTToken(token) {
  try {
    console.log("Store token: ", token)
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token)
    console.log("Stored Token")
  } catch (err) {
    throw new Error(err)
  }
}

export async function removeJWTToken() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN)
    console.log("Removed Token")
  } catch (err) {
    throw new Error(err)
  }
}

export async function storeUser(user) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    console.log("Stored User")
  } catch (err) {
    throw new Error(err)
  }
}

export async function removeUser() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER)
    console.log("Removed User")
  } catch (err) {
    throw new Error(err)
  }
}