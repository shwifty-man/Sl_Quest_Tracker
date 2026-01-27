import React, { useState, useEffect } from "react"
import { Text } from "react-native"
import { getTimeLeft } from "../2_services/timeUtils.js"

export default function Countdown({ deadline }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(deadline))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline))
    }, 500)

    return () => clearInterval(interval)
  }, [deadline])

  return <Text>{timeLeft}</Text>
}
