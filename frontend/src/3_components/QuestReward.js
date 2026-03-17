import { useEffect, useMemo, useRef, useState } from "react"
import { Animated, Text, View } from "react-native"
import { rewardStyles } from "../2_services/styles"
import { useNavigation } from "@react-navigation/native"

function QuestReward({ reward, visible = true }) {
  const navigation = useNavigation()

  const toTitleCase = (value) =>
    String(value)
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())

  const rewardLines = useMemo(
    () =>
      Array.isArray(reward)
        ? reward.map((line) => toTitleCase(line))
        : reward && typeof reward === "object"
          ? Object.entries(reward).flatMap(([key, value]) => {
              if (value && typeof value === "object" && !Array.isArray(value)) {
                return Object.entries(value).map(
                  ([nestedKey, nestedValue]) =>
                    `${toTitleCase(nestedKey)}: ${String(nestedValue)}`,
                )
              }
              return [`${toTitleCase(key)}: ${String(value)}`]
            })
          : reward
            ? [toTitleCase(reward)]
            : [],
    [reward],
  )

  const overlayOpacity = useRef(new Animated.Value(0)).current
  const slotAOpacity = useRef(new Animated.Value(1)).current
  const slotATranslateY = useRef(new Animated.Value(0)).current
  const slotBOpacity = useRef(new Animated.Value(0)).current
  const slotBTranslateY = useRef(new Animated.Value(10)).current
  const [show, setShow] = useState(!!visible)
  const [activeSlot, setActiveSlot] = useState("A")
  const [lineA, setLineA] = useState("")
  const [lineB, setLineB] = useState("")
  const currentIndexRef = useRef(0)
  const activeSlotRef = useRef("A")

  useEffect(() => {
    if (!visible || rewardLines.length === 0) {
      setShow(false)
      return
    }

    setShow(true)
    setActiveSlot("A")
    activeSlotRef.current = "A"
    currentIndexRef.current = 0
    setLineA(rewardLines[0])
    setLineB(rewardLines[1 % rewardLines.length] || "")

    overlayOpacity.setValue(0)
    slotAOpacity.setValue(1)
    slotATranslateY.setValue(0)
    slotBOpacity.setValue(0)
    slotBTranslateY.setValue(10)

    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start()

    const DISPLAY_MS = 1400
    const TRANSITION_MS = 420
    let timeoutId
    let cancelled = false

    const fadeOutOverlay = () => {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        if (!cancelled) setShow(false)
        navigation.navigate("Home")
      })
    }

    if (rewardLines.length < 2) {
      timeoutId = setTimeout(() => {
        if (cancelled) return
        fadeOutOverlay()
      }, DISPLAY_MS)

      return () => {
        cancelled = true
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    let transitionsDone = 0
    const maxTransitions = rewardLines.length - 1

    const queueNext = () => {
      timeoutId = setTimeout(() => {
        if (cancelled) return

        const fromA = activeSlotRef.current === "A"
        const leavingOpacity = fromA ? slotAOpacity : slotBOpacity
        const leavingTranslate = fromA ? slotATranslateY : slotBTranslateY
        const enteringOpacity = fromA ? slotBOpacity : slotAOpacity
        const enteringTranslate = fromA ? slotBTranslateY : slotATranslateY

        const nextIndex = (currentIndexRef.current + 1) % rewardLines.length
        const upcomingIndex = (nextIndex + 1) % rewardLines.length

        if (fromA) {
          setLineB(rewardLines[nextIndex])
        } else {
          setLineA(rewardLines[nextIndex])
        }

        enteringOpacity.setValue(0)
        enteringTranslate.setValue(10)

        Animated.parallel([
          Animated.timing(leavingOpacity, {
            toValue: 0,
            duration: TRANSITION_MS,
            useNativeDriver: true,
          }),
          Animated.timing(leavingTranslate, {
            toValue: -20,
            duration: TRANSITION_MS,
            useNativeDriver: true,
          }),
          Animated.timing(enteringOpacity, {
            toValue: 1,
            duration: TRANSITION_MS,
            useNativeDriver: true,
          }),
          Animated.timing(enteringTranslate, {
            toValue: 0,
            duration: TRANSITION_MS,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (cancelled) return

          currentIndexRef.current = nextIndex
          transitionsDone += 1

          const nextSlot = fromA ? "B" : "A"
          activeSlotRef.current = nextSlot
          setActiveSlot(nextSlot)

          if (transitionsDone >= maxTransitions) {
            timeoutId = setTimeout(() => {
              if (cancelled) return
              fadeOutOverlay()
            }, DISPLAY_MS)
            return
          }

          if (nextSlot === "A") {
            setLineB(rewardLines[upcomingIndex])
          } else {
            setLineA(rewardLines[upcomingIndex])
          }

          queueNext()
        })
      }, DISPLAY_MS)
    }

    queueNext()

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [
    visible,
    rewardLines,
    overlayOpacity,
    slotAOpacity,
    slotATranslateY,
    slotBOpacity,
    slotBTranslateY,
  ])

  if (!visible || rewardLines.length === 0 || !show) return null

  return (
    <Animated.View
      style={[rewardStyles.overlay, { opacity: overlayOpacity }]}
      pointerEvents="none"
    >
      <View style={rewardStyles.card}>
        <Text style={rewardStyles.title}>QUEST COMPLETE!</Text>
        <View>
          <Animated.View
            style={{
              opacity: slotAOpacity,
              transform: [{ translateY: slotATranslateY }],
              position: activeSlot === "A" ? "relative" : "absolute",
              left: 0,
              right: 0,
            }}
          >
            <Text style={rewardStyles.text}>{lineA}</Text>
          </Animated.View>

          <Animated.View
            style={{
              opacity: slotBOpacity,
              transform: [{ translateY: slotBTranslateY }],
              position: activeSlot === "B" ? "relative" : "absolute",
              left: 0,
              right: 0,
            }}
          >
            <Text style={rewardStyles.text}>{lineB}</Text>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  )
}

export default QuestReward
