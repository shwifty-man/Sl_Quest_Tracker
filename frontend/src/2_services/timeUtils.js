export function formatDeadline(isoString) {
  if (!isoString) return "No deadline"

  const date = new Date(isoString)

  // Options for date part
  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }

  // Options for time part
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }

  const datePart = date.toLocaleDateString(undefined, dateOptions)
  const timePart = date.toLocaleTimeString(undefined, timeOptions)

  return `${datePart} at ${timePart}`
}

// src/2_services/timeUtils.js

export function getTimeLeft(isoString) {
  if (!isoString) return null

  const now = new Date()
  const deadline = new Date(isoString)
  let diff = deadline - now // difference in milliseconds

  if (diff <= 0) return "None"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  diff -= days * (1000 * 60 * 60 * 24)

  const hours = Math.floor(diff / (1000 * 60 * 60))
  diff -= hours * (1000 * 60 * 60)

  const minutes = Math.floor(diff / (1000 * 60))
  diff -= minutes * (1000 * 60)

  const seconds = Math.floor(diff / 1000)

  let result = ""
  if (days) result += `${days}d `
  if (hours) result += `${hours}h `
  if (minutes) result += `${minutes}m `
  result += `${seconds}s`

  return result
}
