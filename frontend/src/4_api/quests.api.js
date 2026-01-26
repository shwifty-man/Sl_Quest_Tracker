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
    console.error("response.json(): ", await response.text())
    throw new Error("Failed to fetch quests " + response.status)
  } else {
    console.log("GET quest response was ok")
  }

  const data = await response.json()
  console.log("GET QUESTS: ", data)
  return data
}

// {
//     "questData": {"questTitle": "test1", "unitName": "unittest1", "targetValue": 100}
// }

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
  } catch (err) {
    console.log("fetchCreateQuests: Error:", err)
    throw err
  }
}
