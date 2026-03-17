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
  }

  const data = await response.json()
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
  }

  const data = await response.json()
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
            type: credentials.type,
            unitName: credentials.unitName.trim(),
            targetValue: Number(credentials.targetValue),
          },
        }),
      },
    )

    if (!response.ok) {
      const errData = await response.json().catch(() => null)
      throw new Error(errData?.message || "Failed to create quest")
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error("[quests.api] Failed to create quest", err)
    throw err
  }
}

export async function fetchUpdateProgress(token, questId, newValue) {
  try {
    const currentValue = Number(newValue)
    if (isNaN(currentValue)) throw new Error("Invalid quest value")

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
    }
    return data.quest
  } catch (err) {
    console.error("[quests.api] Failed to update quest progress", err)
    throw err
  }
}

export async function fetchPenaltyForQuest(token) {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/penalties/active`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch penalty " + response.status)
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error("[quests.api] Failed to fetch active penalty", err)
    throw err
  }
}
