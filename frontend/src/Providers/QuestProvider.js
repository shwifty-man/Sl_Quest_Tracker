import React, { createContext, useState, useEffect } from "react"

export const QuestContext = createContext()

export function QuestProvider({ children }) {
  // 2a. State for user, token, and loading
  const [quests, setQuests] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const restoreQuests = async () => {
    // restore quests
  }

  useEffect(() => {
    restoreQuests()
  }, [])

  // 3. Provide state & actions to children
  return <QuestContext.Provider value={{}}>{children}</QuestContext.Provider>
}
