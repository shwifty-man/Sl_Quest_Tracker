import { AuthContext } from "../Providers/AuthProvider"
import { QuestContext } from "../Providers/QuestProvider"
import { useContext } from "react"

// src/2_services/context.js
export function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export function useQuests() {
  const context = useContext(QuestContext)
  return context
}