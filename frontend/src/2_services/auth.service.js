import { AuthContext } from "../AuthProvider"
import { useContext } from "react"

// src/2_services/auth.service.js
export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
