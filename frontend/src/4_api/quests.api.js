export async function fetchQuests(token) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch quests " + response.status)
  } else {
    console.log("GET quest response was ok")
  }

  const data = await response.json()
  console.log("GET QUESTS: ", data)
  return data
}

export async function fetchQuestById(token, questId) {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests/${questId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error("Failed to fetch quest " + response.status)
  } else {
    console.log("GET quest response was ok")
  }

  const data = await response.json()
  console.log("GET QUEST BY ID: ", data)
  return data
}

export async function fetchCreateQuests(token, credentials) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questData: {
            questTitle: credentials.questTitle.trim(),
            unitName: credentials.unitName.trim(),
            targetValue: Number(credentials.targetValue),
          },
        }),
      },
    )

    if (!response.ok) {
      if (response.status === 401) {
        // const { logout } = useAuth()
        console.log("it was 401")
      }
      const errData = await response.json().catch(() => null)
      throw new Error(errData?.message || "Failed to create quest")
    } else {
      console.log("Created Quest")
    }

    const data = await response.json()
    console.log("Create Quest data: ", data)
    return data
  } catch (err) {
    console.log("fetchCreateQuests: Error:", err)
    throw err
  }
}

// {
//     "questData": {"questTitle": "test1", "unitName": "unittest1", "targetValue": 100}
// }

export async function fetchUpdateProgress(token, questId, newValue) {
  try {
    console.log("New Value: ", newValue)

    const currentValue = Number(newValue)
    if (isNaN(currentValue)) throw new Error("Invalid quest value")
    console.log("currentValue: ", currentValue)

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests/${questId}/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentValue }),
      },
    )

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status === 401) throw new Error("Unauthorized")
      throw new Error(data?.message || "Failed to update quest")
    } else {
      console.log("Updated Quest")
    }

    console.log("UPDATE data: ", data.current_value)
    return data.current_value
  } catch (err) {
    console.log("fetchUpdateProgress: Error:", err)
    throw err
  }
}
