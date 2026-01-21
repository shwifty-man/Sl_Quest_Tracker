export async function fetchQuests(token) {
  try {
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
      console.error("response.json(): ", await response.text())
      throw new Error("Failed to fetch quests " + response.status)
    } else {
      console.log("GET quest response was ok")
    }

    const data = await response.json()
    console.log("GET QUESTS: ", data)
    return data
  } catch (err) {
    throw new Error("Failed to fetch quests: " + err.message)
  }
}

// {
//     "questData": {"questTitle": "test1", "unitName": "unittest1", "targetValue": 100}
// }

export async function fetchCreateQuests(token, credentials) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/quests`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questTitle: credentials.questTitle,
          unitName: credentials.unitName,
          targetValue: credentials.targetValue,
        }),
      },
    )

    if (response.ok) {
      console.log("Created Quest")
    }

    const data = await response.json()
    console.log("Create Quest data: ", data)
  } catch (err) {
    throw new Error(err)
  }
}
