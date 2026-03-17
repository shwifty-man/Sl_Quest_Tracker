import { View, Text, Image, Pressable } from "react-native"
import { useEffect, useState } from "react"
import Tag from "./Tag"
import { styles, text, user } from "../2_services/styles"
import Edgeglow from "./EdgeGlow"
import { useAuth, useUser } from "../2_services/context"
import { useNavigation } from "@react-navigation/native"

export default function ViewItem({ route }) {
  const { token } = useAuth()
  const { getUserInventory, getUserShop } = useUser()

  const [item, setItem] = useState(route?.params?.item ?? {})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    setItem(route?.params?.item ?? {})
  }, [route?.params?.item])

  const toggleShop = route?.params?.toggleShop ?? null
  const rawUrl = item?.url
  const cleanUrl = typeof rawUrl === "string" ? rawUrl.trim() : ""

  const url = cleanUrl
    ? cleanUrl.startsWith("http")
      ? cleanUrl
      : `${process.env.EXPO_PUBLIC_BACKEND_URL}${encodeURI(cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`)}`
    : ""

  const name = item?.name
  const description = item?.description
  const quantity = item?.quantity || 0
  let price = item.price
  if (toggleShop === true && item.price <= 0) {
    price = "Free"
  }

  const buttonWord = toggleShop === true ? "Buy" : "Use"

  async function handleUse() {
    if (isSubmitting || quantity <= 0) return

    setIsSubmitting(true)

    try {
      const itemId = item?.id ?? item?.item_id

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/inventory/use`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            itemId,
          }),
        },
      )

      if (!res.ok) {
        throw new Error(`Failed to use item: ${res.status}`)
      }

      const data = await res.json()

      setItem((prev) => ({
        ...prev,
        quantity: Math.max(0, (prev?.quantity ?? 0) - 1),
      }))

      await getUserInventory()
      return data
    } finally {
      setIsSubmitting(false)
      navigation.navigate("Inventory")
    }
  }

  async function handleBuy() {
    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const itemId = item?.shop_item_id

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/shop/buy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId }),
        },
      )

      if (!res.ok) {
        throw new Error(`Failed to buy item: ${res.status}`)
      }

      const data = await res.json()
      await getUserShop()
      await getUserInventory()
      return data
    } finally {
      setIsSubmitting(false)
      navigation.navigate("Inventory")
    }
  }

  const handleAction = toggleShop === true ? handleBuy : handleUse

  return (
    <View style={styles.container}>
      <Edgeglow />
      <View style={user.container}>
        <View style={user.header}>
          <Tag label="Item" />
        </View>
        <Text style={text.name}>{name}</Text>
        <Image source={{ uri: url }} style={user.itemImage} />
        {toggleShop === true ? (
          <Text style={text.gold}>Cost: {price}</Text>
        ) : null}
        <Text style={[text.normal, { width: "70%" }]}>{description}</Text>

        <Pressable
          onPress={handleAction}
          disabled={isSubmitting}
          style={[
            user.pressableButton,
            isSubmitting && {
              opacity: 0.6,
            },
            { marginTop: "auto", borderRadius: 10 },
          ]}
        >
          <Text style={{ fontSize: 18 }}>{buttonWord}</Text>
        </Pressable>
        {toggleShop === false ? (
          <Text style={text.normal}>x{quantity}</Text>
        ) : null}
      </View>
    </View>
  )
}
