import { AuthContext } from "../Providers/AuthProvider"
import { QuestContext } from "../Providers/QuestProvider"
import { useContext } from "react"
import { UserContext } from "../Providers/UserProvider"
import { ErrorContext } from "../Providers/ErrorProvider"

// src/2_services/context.js
export function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export function useQuests() {
  const context = useContext(QuestContext)
  return context
}

export function useUser() {
  return useContext(UserContext)
}

export function useError() {
  return useContext(ErrorContext)
}
