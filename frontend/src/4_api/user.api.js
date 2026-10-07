export async function fetchUpdateHunterName(name, token) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/name`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newName: name }),
    },
  )

  if (!response.ok) {
    throw new Error("Failed to POST Hunter name " + response.status)
  }

  const data = await response.json()
  return data
}

export async function fetchUserProfile(token) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/profile`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to GET Hunter profile " + response.status)
    }

    const raw = await response.text()
    const data = raw ? JSON.parse(raw) : {}
    return data
  } catch (err) {
    console.error("[user.api] Failed to fetch user profile", err)
    throw err
  }
}

export async function fetchUserInventory(token) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/inventory`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to GET Inventory " + response.status)
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error("[user.api] Failed to fetch inventory", err)
    throw err
  }
}

export async function fetchUserShop(token) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/shop/`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to GET shop " + response.status)
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error("[user.api] Failed to fetch shop", err)
    throw err
  }
}

export async function fetchUserSetup(token) {
  try {
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/setup`

    console.log("b4 response")
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    })
    console.log("after", response)
    if (!response.ok) {
      throw new Error("Failed to PUT setup" + response.status)
    }

    const data = await response.json()
    console.log("data", data)
    return data
  } catch (err) {
    console.error("[user.api] Failed to fetch setup", err)
    throw err
  }
}
