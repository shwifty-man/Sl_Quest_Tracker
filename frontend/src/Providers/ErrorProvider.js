import React, { createContext, useCallback, useState } from "react"

export const ErrorContext = createContext({
  error: null,
  setError: () => {},
  clearError: () => {},
})

export function ErrorProvider({ children }) {
  const [error, setErrorState] = useState(null)

  function sanitizeErrorMessage(input) {
    const raw =
      typeof input === "string"
        ? input
        : input?.message
          ? String(input.message)
          : ""

    const withoutUrl = raw.replace(/https?:\/\/[^\s)]+/gi, "[server]")
    const lowered = withoutUrl.toLowerCase()

    if (!withoutUrl.trim()) {
      return "Something went wrong. Please try again."
    }

    if (
      lowered.includes("network request failed") ||
      lowered.includes("failed to fetch") ||
      lowered.includes("network") ||
      lowered.includes("econn") ||
      lowered.includes("timed out")
    ) {
      return "Could not connect to the server. Please try again."
    }

    if (lowered.includes("401") || lowered.includes("unauthorized")) {
      return "Your session expired. Please log in again."
    }

    return withoutUrl
  }

  const setError = useCallback((err) => {
    setErrorState(sanitizeErrorMessage(err))
  }, [])

  const clearError = useCallback(() => {
    setErrorState(null)
  }, [])

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  )
}
