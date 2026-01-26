import AsyncStorage from "@react-native-async-storage/async-storage"

export async function fetchLogin(credentials) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      },
    )
    if (!response.ok) {
      throw new Error(
        "Network response was not ok and status: " + response.status,
      )
    }

    const data = await response.json()

    if (response.ok) {
      console.log("Login response was ok.")
    }
    return data
  } catch (error) {
    throw new Error("Fetching data:" + error)
  }
}

export async function fetchRegister(credentials) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      },
    )
    if (!response.ok) {
      throw new Error("Network response was NOT ok. Status: " + response.status)
    }
    const data = await response.json()
    return data
  } catch (err) {
    console.error("Error fetching data:", err)
    throw err
  }
}
